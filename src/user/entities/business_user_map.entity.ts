import { BusinessUserMapStatus } from '../enum/business_user_map_status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('business_user_map')
@Unique(['email_id', 'status']) // Composite unique constraint
export class BusinessUserMap {
  @PrimaryGeneratedColumn('uuid') // Assuming you want a primary key
  id: string;

  @Column({ nullable: false })
  email_id: string;

  @Column({ nullable: true })
  business_id: string;

  @Column({
    nullable: false,
    default: BusinessUserMapStatus.ACTIVE,
    type: 'enum',
    enum: BusinessUserMapStatus,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
