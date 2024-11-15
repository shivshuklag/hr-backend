import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: +process.env.SMTP_PORT || 587,
        secure: false, // True for 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerModule],
})
export class MailerModule {}
