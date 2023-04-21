import { Column, Entity } from 'typeorm';
import { IVerificationCodeData } from '../../types';
import { Base } from './base.entity';

@Entity('verificationCodes')
export class VerificationCodesEntity extends Base {
  @Column()
  userId!: string;

  @Column()
  codes: IVerificationCodeData[] = [];
}
