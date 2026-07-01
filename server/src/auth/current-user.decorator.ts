import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom decorator to retrieve the authenticated user's details from the request object.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
