import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.headers?.authorization?.replace(/Bearer /g, '');
  },
);
