import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from './auth.guard';
// contact.dto.ts
export class ContactDto {
  firstName: string;
  lastName: string;
  orderId?: string; // Optional field
  subject: string;
  message: string;
  email: string;
}

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

  @Post('contact')
  async submitContactForm(@Body() contactData: ContactDto) {
    return await this.authService.sendContactForm(contactData);
  }
}
