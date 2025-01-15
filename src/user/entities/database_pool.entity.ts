import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('database_pool')
export class DatabasePool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  dbname: string;

  @Column({ nullable: false })
  server_id: string;

  @Column({ nullable: false, default: true })
  is_available: boolean;

  @Column({ nullable: false, default: false })
  is_taken: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
