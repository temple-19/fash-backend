import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  HttpException,
  Patch,
  Delete,
  Headers,
  BadRequestException,
  Req,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { OrderService } from './order.service';
import * as crypto from 'crypto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  // make refund route
  //pay route
  @Post()
  @UsePipes(new ValidationPipe())
  createOrder(@Body() createOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // @Post('web')
  // async handleWebhook(@Body() body: any) {
  //   console.log('Webhook event data:', body.data.reference.event);
  //   //if the body.event = "paymentrequest.success"do this {
  //   return this.orderService.webhook(body.data.reference);
  //   //}
  //   //if body.event = "refund.failed" {update the order status as refund failed}
  //   //if body.event = "refund.processed" {update the order status as refund success}
  // }

  @Post('web')
  async handleWebhook(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
    @Req() req: any,
  ) {
    try {
      // Log the received event for debugging purposes
      const eventType = body.event;
      const reference = body.data.reference;
      console.log('Webhook event:', eventType);
      console.log('Transaction reference:', reference);

      // Step 1: Validate Paystack signature
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const rawBody = JSON.stringify(body); // Ensure the body is stringified correctly
      const hash = crypto
        .createHmac('sha512', secret)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        throw new BadRequestException('Invalid Paystack signature');
      }

      // Step 2: Handle specific event types
      if (eventType === 'charge.success' || eventType === 'refund.success') {
        // Process the event based on the reference
        await this.orderService.webhook(reference);
        return {
          status: 'success',
          message: `Order status updated for ${eventType}`,
        };
      } else {
        // Log ignored events for visibility
        console.log(`Event ${eventType} ignored`);
        return {
          status: 'ignored',
          message: `Event ${eventType} ignored`,
        };
      }
    } catch (error) {
      console.error('Webhook error:', error.message);
      return {
        status: 'error',
        message: `Error processing webhook: ${error.message}`,
      };
    }
  }

  @Get()
  getUsers() {
    return this.orderService.getOrders();
  }

  // order/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.orderService.getOrderById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('id') id: string, @Body() updateProductDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const updatedUser = await this.orderService.updateOrder(
      id,
      updateProductDto,
    );
    if (!updatedUser) throw new HttpException('User Not Found', 404);
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const deletedUser = await this.orderService.deleteOrder(id);
    if (!deletedUser) throw new HttpException('User Not Found', 404);
    return;
  }
}
