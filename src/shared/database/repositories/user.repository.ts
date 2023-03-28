import { LoggerInstance, SessionKeyService } from '../../services';
import { ISessionKeyData, ObjectIDByTypeORM } from '../../types';
import { MongoManager } from '../connection';
import { UserEntity } from '../entities';

// @ts-ignore
import { ObjectID } from 'mongodb';

export const removeInvalidSKsById = async (userId: ObjectIDByTypeORM) => {
  const user = await UserEntity.findOneBy({ _id: new ObjectID(userId) });

  if (user) {
    const invalidSessionKeys = user.sessionKeys.filter(
      (sessionKey) => !SessionKeyService.isValid(sessionKey)
    );

    if (invalidSessionKeys.length > 0) {
      await MongoManager.updateOne(
        UserEntity,
        { _id: userId },
        { $pull: { sessionKeys: { $in: invalidSessionKeys } } }
      );
    } else {
      LoggerInstance.info(`User ${userId} does not have invalid session keys.`);
    }
  }

  return user;
};

export const pushSessionKeyById = async (
  userId: ObjectIDByTypeORM,
  sessionKey: ISessionKeyData
) => {
  await MongoManager.updateOne(
    UserEntity,
    {
      _id: userId,
    },
    { $push: { sessionKeys: sessionKey } }
  );
};
