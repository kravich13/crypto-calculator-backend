import { DateTime } from 'luxon';
import { emailConfig } from '../../shared/configs';
import {
  UserEntity,
  VerificationCodesEntity,
  VerificationCodesRepository,
} from '../../shared/database';
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
    const currentDate = DateTime.utc();

    const savedCodes = await VerificationCodesEntity.findOneBy({ userId });

    if (savedCodes) {
      const codeResendExpiresIn = DateTime.fromJSDate(savedCodes.updatedAt)
        .plus({ seconds: emailConfig.resendExpiresIn })
        .toMillis();

      if (+currentDate < codeResendExpiresIn) {
        throw new BadRequestException('Wait before you can request another code.');
      }
    }

    const emailCodeResendExpiresIn = currentDate
      .plus({ seconds: emailConfig.resendExpiresIn })
      .toMillis();

    const codeData = VerificationCodeService.createCode();

    try {
      await EmailService.sendSignInLetter(email, codeData.code);
      await VerificationCodesRepository.pushOrUpdateVCsByUserId({
        userId,
        codeData,
        existCodes: savedCodes?.codes,
      });
    } catch (err) {
      LoggerInstance.error('Send message to email error.');
      throw new InternalServerError('Internal server error.');
    }

    return {
      emailCodeResendExpiresIn,
    };
  },
};
