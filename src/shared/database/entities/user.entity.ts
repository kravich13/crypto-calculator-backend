import { Column, Entity } from 'typeorm';
import { UserStateEnum } from '../../enums/user-state.enum';
import { Base } from './base.entity';

@Entity('user')
export class UserEntity extends Base {
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  salt!: string;

  @Column()
  sessionKey!: string;

  @Column({ default: UserStateEnum.NOT_VERIFIED })
  state!: UserStateEnum;
}
