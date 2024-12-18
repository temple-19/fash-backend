import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  HttpException,
  Patch,
  Headers,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderService } from './order.service';

import * as coinbase from 'coinbase-commerce-node';

const { Webhook } = coinbase;

// interface CustomRequest extends Request {
//   rawBody?: string;
// }

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  // make refund route
  //pay route

  @Post('cxp')
  @UsePipes(new ValidationPipe())
  createOrderCrypto(@Body() createOrderDto) {
    return this.orderService.createOrderCrypto(createOrderDto);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createOrder(@Body() createOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-cc-webhook-signature') signature: string,
  ) {
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

    try {
      // Verify the event using raw body and signature
      const event = Webhook.verifyEventBody(
        req.rawBody,
        signature,
        webhookSecret,
      );

      // Access the event type
      if (event.type === 'charge:confirmed') {
        const amount = event.data.pricing.local.amount;
        const currency = event.data.pricing.local.currency;
        const userId = event.data.metadata.user_id;

        // Process the confirmed charge, e.g., update your database
        console.log(
          `Charge confirmed for ${amount} ${currency} for user ${userId}`,
        );
        //au verify function
        // if (response.data.data.status === 'success') {
        // // Retrieve the corresponding order
        // let order = await this.orderModel.findOne({ reference });

        // if (!order || order.orderStatus == 'PAID') {
        //   throw new Error('Order not found or paid already');
        // }

        // // Loop through the items in the order and update each product's stock and topProducts count
        // for (const item of order.items) {
        //   const product = await this.productModel.findOne({ _id: item.id });

        //   if (!product) {
        //     throw new Error(`Product with id ${item.id} not found`);
        //   }

        //   // Reduce product quantity based on the order item quantity
        //   product.quantity -= item.quantity;

        //   // Ensure product quantity doesn't go below zero
        //   if (product.quantity < 0) {
        //     throw new Error(`Not enough stock for product ${item.name}`);
        //   }

        //   // Increment topProducts count
        //   product.topProducts += item.quantity;

        //   // Save the updated product back to the database
        //   await product.save();
        // }

        // // Update the order status to 'PAID' and save it
        // order.orderStatus = 'PAID';
        // await order.save();

        // let currentYear = new Date().getFullYear();
        // let currentMonth = new Date().toLocaleString('en-US', {
        //   month: 'long',
        // });

        // // Check if a record for the current month and year exists
        // let existingRevenue = await this.revenueModel.findOne({
        //   month: currentMonth,
        //   year: currentYear,
        // });
        // if (!existingRevenue) {
        //   let newRevenue = new this.revenueModel({
        //     month: currentMonth,
        //     year: currentYear,
        //     revenue: order.amount, // Set initial revenue to zero
        //     totalOrder: 1,
        //   });

        //   await newRevenue.save();

        // return 'Charge confirmed';
      } else {
        // Handle other event types if needed
        console.log(`Unhandled event type: ${event.type}`);
        return 'Event received';
      }
    } catch (error) {
      // If verification fails, send an error response
      console.error('Webhook verification failed', error.message);
      throw new HttpException(
        'Webhook verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get()
  getUsers() {
    return this.orderService.getOrders();
  }

  // order/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    let findUser = await this.orderService.getOrderById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }
  @Get('ref/:id')
  async getUserrefId(@Param('id') id: string) {
    let findUser = await this.orderService.getOrderByref(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }
  @Post('au/rf')
  testv(@Body('reference') reference: string) {
    return this.orderService.callbackVerify(reference);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('id') id: string, @Body() updateProductDto) {
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    let updatedUser = await this.orderService.updateOrder(id, updateProductDto);
    if (!updatedUser) throw new HttpException('User Not Found', 404);
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    let deletedUser = await this.orderService.deleteOrder(id);
    if (!deletedUser) throw new HttpException('User Not Found', 404);
    return;
  }
}
