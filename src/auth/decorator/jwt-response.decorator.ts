import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtResponseInterface } from '../interfaces/jwt.interface';

export const JwtProcessed = createParamDecorator(
  (data: any, ctx: ExecutionContext): JwtResponseInterface => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
