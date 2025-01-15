import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { TokenPayloadDto } from 'src/auth/dto/token.dto';
import { Token } from 'src/auth/interfaces/token.interface';
import { configService } from 'src/config/config.service';
import { ErrorMessage } from 'src/message/error.message';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { EnvironmentEnum } from 'src/auth/enum/environment.enum';
import { MasterService } from 'src/master/master.service';
import { JwtResponseInterface } from 'src/auth/interfaces/jwt.interface';
import { VerifyDto } from 'src/auth/dto/verify.dto';
import { generateOtp } from 'src/utils/generate_otp.util';
import { RedisService } from 'src/redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { OTP_TEMPALTE } from 'src/mailer/templates/otp.template';
import { SuccessMessage } from 'src/message/success.message';
import { UserRoleEnum } from 'src/user/enum/user_role.enum';
import { getCurrentDateTimeIST } from 'src/utils/ist_date_time.util';
import { LoginDto } from 'src/auth/dto/login.dto';
import { verifyHash } from 'src/utils/verify_hash.util';

export const cookieOptions = {
  sameSite: 'none' as const,
  secure: true,
  httpOnly: false,
  domain:
    configService.getValue('MODE') === EnvironmentEnum.PROD
      ? configService.getValue('COOKIE_DOMAIN')
      : null,
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private masterService: MasterService,
    private redisService: RedisService,
    private mailerService: MailerService,
  ) {}
  async register(registerDto: RegisterDto, response: Response) {
    const admin = await this.masterService.getMasterUserByEmail(
      registerDto?.emailId,
    );

    if (admin) {
      return { message: ErrorMessage.ACCOUNT_EXISTS };
    }
    const createAdmin = await this.masterService.createMasterUser(registerDto);

    await this.masterService.assignDatabaseToBusiness(createAdmin?.id);

    const createdUser = await this.userService.createUser(createAdmin?.id, {
      id: createAdmin?.id,
      email_id: registerDto?.emailId,
      user_role: UserRoleEnum.ADMIN,
    });

    await this.masterService.addToBusinessUserMap({
      id: createdUser?.id,
      emailId: registerDto?.emailId,
      businessId: createAdmin?.id,
    });

    const tokenPayload: TokenPayloadDto = {
      id: createAdmin?.id,
      businessId: createAdmin?.id,
      emailId: registerDto?.emailId,
    };

    // Send otp
    await this.sendOtp(createAdmin?.id, registerDto?.emailId);

    const tokens: Token = await this.getTokens(tokenPayload);

    response.cookie('accessToken', tokens?.accessToken, {
      expires: new Date(
        Date.now() +
          +configService.getValue('COOKIE_EXPIRES_IN') * 24 * 60 * 60 * 1000,
      ),
      ...cookieOptions,
    });
    response.cookie('refreshToken', tokens?.refreshToken, {
      expires: new Date(
        Date.now() +
          +configService.getValue('COOKIE_EXPIRES_IN') * 24 * 60 * 60 * 1000,
      ),
      ...cookieOptions,
    });

    return {
      status: SuccessMessage.SUCCESS,
      message: SuccessMessage.REGSITER_MESSAGE,
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const businessId = await this.masterService.getBusinessIdFromUserMap(
      loginDto?.emailId,
    );
    const user = await this.userService.getUserByEmail(
      businessId,
      loginDto?.emailId,
    );

    const passwordMatch = verifyHash(loginDto?.password, user?.password);

    if (!passwordMatch) {
      return {
        status: ErrorMessage.ERROR,
        message: ErrorMessage.AUTHENTICATION_ERROR,
      };
    }

    const tokenPayload: TokenPayloadDto = {
      id: user?.id,
      businessId: businessId,
      emailId: loginDto?.emailId,
    };

    const tokens: Token = await this.getTokens(tokenPayload);

    response.cookie('accessToken', tokens?.accessToken, {
      expires: new Date(
        Date.now() +
          +configService.getValue('COOKIE_EXPIRES_IN') * 24 * 60 * 60 * 1000,
      ),
      ...cookieOptions,
    });
    response.cookie('refreshToken', tokens?.refreshToken, {
      expires: new Date(
        Date.now() +
          +configService.getValue('COOKIE_EXPIRES_IN') * 24 * 60 * 60 * 1000,
      ),
      ...cookieOptions,
    });

    return {
      status: SuccessMessage.SUCCESS,
      message: SuccessMessage.LOGIN_MESSAGE,
    };
  }

  async verifyOtp(jwtDecoded: JwtResponseInterface, verifyDto: VerifyDto) {
    const storedOtp = await this.redisService.getCache(`otp:${jwtDecoded?.id}`);
    if (!storedOtp) return false;

    const isValid = storedOtp === verifyDto?.otp;

    if (isValid) {
      // Remove OTP from cache after successful verification
      await this.redisService.delCache(`otp:${jwtDecoded?.id}`);
      await this.masterService.updateMasterUser(jwtDecoded, {
        email_verified_at: getCurrentDateTimeIST(),
      });
      return {
        status: SuccessMessage.SUCCESS,
        message: SuccessMessage.OTP_VERIFICATION_MESSAGE,
      };
    }

    return {
      status: ErrorMessage.ERROR,
      message: ErrorMessage.OTP_VERIFICATION_ERROR,
    };
  }

  async resend(userId: string, emailId: string) {
    try {
      await this.sendOtp(userId, emailId);
      return {
        status: SuccessMessage.SUCCESS,
        message: SuccessMessage.OTP_MESSAGE,
      };
    } catch (err) {
      return { status: ErrorMessage.ERROR, message: err?.message };
    }
  }

  async validateUser(userName: string, password: string) {
    return 'User';
  }

  async getTokens(payload: TokenPayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: configService.getValue('JWT_SECRET'),
      expiresIn: configService.getValue('JWT_EXPIRY'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: configService.getValue('JWT_REFRESH_SECRET'),
      expiresIn: configService.getValue('JWT_REFRESH_EXPIRY'),
    });

    return { accessToken, refreshToken };
  }

  async sendOtp(userId: string, emailId: string) {
    const otp = generateOtp(6);
    const ttl = 300;

    // Store OTP in Redis with expiration
    await this.redisService.setCache(`otp:${userId}`, otp, ttl);

    // You would typically send the OTP to the user via email/SMS here
    try {
      await this.mailerService.sendMail({
        from: {
          name: 'HR App',
          address: 'shivshuklag@gmail.com',
        },
        to: emailId,
        subject: 'Your OTP code',
        html: OTP_TEMPALTE.replace('{{otp}}', otp),
      });
    } catch (err) {
      console.error(`Error while sending otp: `, err);
    }
  }
}
