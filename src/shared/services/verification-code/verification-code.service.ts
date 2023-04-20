import { randomInt } from 'crypto';
import { DateTime } from 'luxon';
import { VerificationCodeEntity } from '../../database';
import { IGenerageCodeOutput } from './outputs';
import { emailConfig } from '../../configs';

export const createCode = (): IGenerageCodeOutput => {
  const date = DateTime.utc();

  const code = String(randomInt(101010, 999999));
  const expiresAt = date.plus({ minutes: emailConfig.lifetimeExpiresIn }).toJSDate();

  return { code, expiresAt };
};

export const validateCode = (
  savedCode: VerificationCodeEntity | null,
  receivedCode: string
): void => {
  if (!savedCode || savedCode.code !== receivedCode) {
    throw new Error('Invalid code sent.');
  }

  const currentDate = DateTime.utc();
  const codeExpiresAt = DateTime.fromJSDate(savedCode.expiresAt);

  if (+currentDate > +codeExpiresAt) {
    throw new Error('Code lifetime expired..');
  }
};
