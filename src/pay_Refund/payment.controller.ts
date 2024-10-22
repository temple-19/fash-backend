import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('refund')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('')
  async hanndleRefund(@Req() req, @Body() body: any) {
    return this.paymentService.refund(req, body);
  }

  @Get('')
  async Getrefunds(@Req() req) {
    return this.paymentService.getRefunds(req);
  }
}
