import { randomInt } from 'crypto';
import { DateTime } from 'luxon';
import { emailConfig } from '../../configs';
import { IVerificationCodeData } from '../../types';
import { GenerageCodeOutput } from './outputs';

export const createCode = (): GenerageCodeOutput => {
  const date = DateTime.utc();
  const code = String(randomInt(101010, 999999));
  const expiresIn = date.plus({ second: emailConfig.codeLifetime }).toMillis();

  return { expiresIn: expiresIn, code };
};

export const validateCode = (codes: IVerificationCodeData[], receivedCode: string): void => {
  const codeData = codes.find(({ code }) => code === receivedCode);

  if (!codeData) {
    throw new Error('Invalid code sent.');
  }

  const currentDate = DateTime.utc();
  const codeExpiresIn = DateTime.fromMillis(codeData.expiresIn);

  if (+currentDate > +codeExpiresIn) {
    throw new Error('Code lifetime expired.');
  }
};

export const isValidCode = (code: IVerificationCodeData) => {
  const date = DateTime.utc();

  return code.expiresIn > date.toMillis();
};
