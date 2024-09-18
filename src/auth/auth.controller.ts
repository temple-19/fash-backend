import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from './auth.guard';

export class autheoObj {
  email: string;
  otp: string;
}
export class autheObj {
  email: string;
}
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verifyOtp')
  verify(@Body() data: autheoObj) {
    return this.authService.verifyOTP(data);
  }

  @Get('sendOtp')
  sendOTP(@Body() data: autheObj) {
    return this.authService.sendOTP(data);
  }

  @Get('resendOtp')
  resendOTP(@Body() data: autheObj) {
    return this.authService.resendOTP(data);
  }
}
