import { NotFoundException } from '@nestjs/common';

require('dotenv').config();
export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true) {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new NotFoundException(`Config error not found in env.${key}`);
    }
    return value;
  }
}

const configService = new ConfigService(process.env);

export { configService };
