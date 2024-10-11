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
  Req,
  Res,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { OrderService } from './order.service';

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

  @Post('web')
  async handleWebhook(@Req() req: any, @Res() res: any) {
    console.log('Webhook event data:', req.body);
    //if the body.event = "paymentrequest.success"do this {
    const event = req.body;
    console.log('winter rabit');
    // Do something with event
    //  this.orderService.webhook(req.body);
    res.send(200);
    //}
    //if body.event = "refund.failed" {update the order status as refund failed}
    //if body.event = "refund.processed" {update the order status as refund success}
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
  @Get('auth/aaa')
  testv(@Body('reference') reference: string) {
    return this.orderService.testv(reference);
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
