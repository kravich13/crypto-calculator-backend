import { DateTime } from 'luxon';
import { emailConfig } from '../../shared/configs';
import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { BadRequestException, InternalServerError } from '../../shared/errors';
import { EmailService, LoggerInstance, VerificationCodeService } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { ISignInBodyInput, signInSchema } from './schemas';

export const signInController: ControllerOptions<{ Body: ISignInBodyInput }> = {
  url: '/sign-in',
  method: 'POST',
  schema: signInSchema,
  handler: async (req, reply) => {
    const { email } = req.body;

    let user = await UserEntity.findOneBy({ email });

    if (!user) {
      user = await UserEntity.create({ email }).save();
    }

    const userId = String(user._id);
    const savedCode = await VerificationCodeEntity.findOneBy({ userId });

    if (savedCode) {
      const currentDate = DateTime.utc();
      const codeExpiresAt = DateTime.fromJSDate(savedCode.createdAt).plus({
        seconds: emailConfig.resendExpiresIn,
      });

      if (+currentDate < +codeExpiresAt) {
        throw new BadRequestException('Wait before you can request another code.');
      }

      await VerificationCodeEntity.delete({ userId });
    }

    const { code, expiresAt } = VerificationCodeService.createCode();

    try {
      await EmailService.sendSignInLetter(email, code);
      await VerificationCodeEntity.create({ userId, code, expiresAt }).save();
    } catch (err) {
      LoggerInstance.error('Send message to email error.');
      throw new InternalServerError('Internal server error.');
    }

    return {
      emailCodeExpiresIn: DateTime.fromJSDate(expiresAt).toMillis(),
    };
  },
};
