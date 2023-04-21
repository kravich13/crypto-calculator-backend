import { jwtConfig } from '../../shared/configs';
import {
  UserEntity,
  UserRepository,
  VerificationCodesEntity,
  VerificationCodesRepository,
} from '../../shared/database';
import { BadRequestException, UnauthorizedException } from '../../shared/errors';
import {
  JWTService,
  LoggerInstance,
  SessionKeyService,
  VerificationCodeService,
} from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { IValidateEmailBodyInput, validateEmailSchema } from './schemas';

const { accessDeathDate, refreshDeathDate } = jwtConfig;

export const validateEmailController: ControllerOptions<{ Body: IValidateEmailBodyInput }> = {
  url: '/email/validate',
  method: 'POST',
  schema: validateEmailSchema,
  handler: async (req, reply) => {
    const { code: receivedCode, email } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const userId = String(user._id);

    const savedCodes = await VerificationCodesEntity.findOneBy({ userId });

    if (!savedCodes) {
      throw new UnauthorizedException('User is not found.');
    }

    try {
      VerificationCodeService.validateCode(savedCodes.codes, receivedCode);
    } catch (err: any) {
      LoggerInstance.error('Verification code error.');

      await VerificationCodesRepository.removeInvalidVCsByUserId(userId);

      throw new UnauthorizedException(err.message);
    }

    const sessionKey = SessionKeyService.create();

    await Promise.allSettled([
      UserRepository.pushSessionKeyById(user._id, sessionKey),
      VerificationCodesRepository.removeInvalidVCsByUserId(userId),
    ]);

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        payload: { sessionKey, userId: user._id },
        accessDeathDate,
        refreshDeathDate,
      });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  },
};
