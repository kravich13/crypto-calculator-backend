import { randomUUID } from 'crypto';
import { jwtConfig } from '../../shared/configs';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { EmailEnum } from '../../shared/enums';
import { BadRequestException } from '../../shared/errors';
import {
  EmailService,
  HashingService,
  JWTService,
  VerificationCodeService,
} from '../../shared/services';
import { ISignUpBodyInput, signUpSchema } from './schemas';
import { RouteCustomOptions } from './types';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const signUpRoute: RouteCustomOptions<ISignUpBodyInput> = {
  url: '/sign-up',
  method: 'POST',
  schema: signUpSchema,
  handler: async (req, reply) => {
    const { email, password } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (user) {
      throw new BadRequestException('User exists.');
    }

    const sessionKey = randomUUID();
    const salt = randomUUID();
    const passwordHash = HashingService.createHash(password, sessionKey);
    const dataUser = UserEntity.create({ email, passwordHash });

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        sessionKey,
        jwtSecret: secret,
        accessDeathDate,
        refreshDeathDate,
      });

    dataUser.sessionKey = sessionKey;
    dataUser.salt = salt;
    await dataUser.save();

    const { code, expiresAt } = VerificationCodeService.createCode();

    await VerificationCodesEntity.create({
      userId: String(dataUser._id),
      code: '123456',
      expiresAt,
    }).save();

    await EmailService.sendMessageToEmail(email, code, EmailEnum.REGISTRATION_LETTER);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  },
};