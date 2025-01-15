import { UserStatusEnum } from '../enum/user_status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enum/user_role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email_id: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    nullable: false,
    default: UserRoleEnum.NORMAL,
    type: 'enum',
    enum: UserRoleEnum,
  })
  user_role: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({
    nullable: false,
    default: UserStatusEnum.CREATED,
    type: 'enum',
    enum: UserStatusEnum,
  })
  user_status: string;

  @Column({ nullable: true })
  email_verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
