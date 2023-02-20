import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { UserStateEnum } from '../../shared/enums';
import { UnauthorizedException } from '../../shared/errors';
import { LocalStorage, VerificationCodeService } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { statusOutputSuccess } from '../../shared/view-models';
import { IValidateEmailBodySchema, validateEmailSchema } from './schemas/validate-email.schema';

export const validateEmailRoute: RouteCustomOptions<{ Body: IValidateEmailBodySchema }> = {
  url: '/email/validate',
  method: 'POST',
  schema: validateEmailSchema,
  handler: async (req, reply) => {
    const { code: receivedCode } = req.body;
    const user = LocalStorage.getUser();

    const savedCode = await VerificationCodeEntity.findOneBy({ userId: String(user._id) });

    try {
      VerificationCodeService.validateCode(savedCode, receivedCode);
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }

    await UserEntity.update(user._id, { state: UserStateEnum.VERIFIED });

    return statusOutputSuccess;
  },
};
