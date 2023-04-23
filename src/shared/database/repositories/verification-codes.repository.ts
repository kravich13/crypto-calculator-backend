import { DateTime } from 'luxon';
import { VerificationCodeService } from '../../services';
import { IVerificationCodeData } from '../../types';
import { MongoManager } from '../connection';
import { VerificationCodesEntity } from '../entities';

interface IPushOrUpdateVCsByUserIdInput {
  userId: string;
  codeData: IVerificationCodeData;
  existCodes?: IVerificationCodeData[];
}

export const removeInvalidVCsByUserId = async (userId: string) => {
  const savedCodes = await VerificationCodesEntity.findOneBy({ userId });

  if (!savedCodes) {
    throw new Error('User is not found.');
  }

  const invalidVerificationCodes = savedCodes.codes.filter(
    (code) => !VerificationCodeService.isValidCode(code)
  );

  if (invalidVerificationCodes.length > 0) {
    await MongoManager.updateOne(
      VerificationCodesEntity,
      { userId },
      { $pull: { codes: { $in: invalidVerificationCodes } } as any }
    );
  }

  return savedCodes;
};

export const updateUpdatedAtByUserId = async (userId: string) => {
  await VerificationCodesEntity.update({ userId }, { updatedAt: DateTime.utc().toJSDate() });
};

export const pushOrUpdateVCsByUserId = async ({
  userId,
  codeData,
  existCodes,
}: IPushOrUpdateVCsByUserIdInput) => {
  if (!existCodes) {
    await VerificationCodesEntity.create({ userId, codes: [codeData] }).save();

    return;
  }

  const codeExists = existCodes.some(({ code }) => code === codeData.code);

  if (codeExists) {
    await Promise.all([
      MongoManager.updateOne(
        VerificationCodesEntity,
        { userId, 'codes.code': codeData.code },
        { $set: { 'codes.$.expiresIn': codeData.expiresIn } as any }
      ),
      updateUpdatedAtByUserId(userId),
    ]);
  } else {
    await Promise.all([
      MongoManager.updateOne(
        VerificationCodesEntity,
        { userId },
        { $push: { codes: codeData } as any }
      ),
      updateUpdatedAtByUserId(userId),
    ]);
  }
};
