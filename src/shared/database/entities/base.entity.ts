import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id!: ObjectId;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
