import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('refund')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('')
  async hanndleRefund(@Body() body: any) {
    return this.paymentService.refund(body);
  }

  @Get('')
  async Getrefunds() {
    return this.paymentService.getRefunds();
  }
}
