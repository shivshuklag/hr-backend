import { BusinessStatusEnum } from '../../user/enum/business_status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email_id: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  business_name: string;

  @Column({ nullable: true })
  business_size: string;

  @Column({
    nullable: false,
    default: BusinessStatusEnum.CREATED,
    type: 'enum',
    enum: BusinessStatusEnum,
  })
  business_status: string;

  @Column({ nullable: true })
  email_verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  host: string;

  @Column({ nullable: true })
  db_name: string;
}
