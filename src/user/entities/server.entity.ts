import { ServerStatusEnum } from '../enum/server_status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('server')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  identifier: string;

  @Column({ nullable: false })
  host: string;

  @Column({ nullable: false, default: false })
  is_open: boolean;

  @Column({ nullable: false, type: 'enum', enum: ServerStatusEnum })
  server_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
