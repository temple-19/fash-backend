import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from './auth.guard';

export class autheoObj {
  email: string;
  otp: string;
}
export class autheObj {
  email: string;
}
@Controller('au')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  verify(@Body() data: autheoObj) {
    return this.authService.verifyOTP(data);
  }

  @Post('trigger')
  sendOTP(@Body() data: autheObj) {
    return this.authService.sendOTP(data);
  }

  @Post('refresh')
  resendOTP(@Body() data: autheObj) {
    return this.authService.resendOTP(data);
  }
}
