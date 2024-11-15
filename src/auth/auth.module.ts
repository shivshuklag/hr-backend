import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { MasterModule } from 'src/master/master.module';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtRefreshAuthGuard } from 'src/auth/guard/jwt-refresh-auth.guard';
import { JwtRefreshStrategy } from 'src/auth/strategy/jwt-rt.strategy';

@Module({
  imports: [
    forwardRef(() => JwtModule),
    forwardRef(() => RedisModule),
    forwardRef(() => MailerModule),
    forwardRef(() => UserModule),
    forwardRef(() => MasterModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    JwtRefreshAuthGuard,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
