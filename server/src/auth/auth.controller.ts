import { Controller, Post, Body, Get, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  getNonce() {
    return { nonce: this.authService.getNonce() };
  }

  @Post('verify')
  async verify(
    @Body('message') message: string,
    @Body('signature') signature: string,
    @Res({ passthrough: true }) response: any,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.verifySignature(message, signature);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken, user };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: any,
  ) {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: any) {
    const refreshToken = request.cookies['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    response.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }
}
