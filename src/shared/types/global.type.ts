import { ObjectId } from 'typeorm';

export type ObjectIDByTypeORM = ObjectId;

export interface IObjectId {
  _id: ObjectIDByTypeORM;
}
