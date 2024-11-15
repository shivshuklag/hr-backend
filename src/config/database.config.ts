import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from './config.service';
import { join } from 'path';

const config = {
  type: 'postgres',
  host: configService.getValue('DATABASE_HOST'),
  port: +configService.getValue('DATABASE_PORT'),
  username: configService.getValue('DATABASE_USERNAME'),
  password: configService.getValue('DATABASE_PASSWORD'),
  database: configService.getValue('DATABASE_NAME'),
  entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
