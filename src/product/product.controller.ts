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
} from '@nestjs/common';
import mongoose from 'mongoose';
import { ProductService } from './product.service';

@Controller('item')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createProduct(@Body() createProductDto) {
    console.log(createProductDto);
    return this.productService.createProduct(createProductDto);
  }

  @Post('collection')
  createColl(@Body() createProductDto) {
    console.log(createProductDto);
    return this.productService.createColl(createProductDto);
  }

  @Post('test')
  test(@Body('email') email: string, @Body('amount') amount: number) {
    return this.productService.test(amount, email); // Notice the parameter order, `amount` comes first in your service
  }

  @Get('test')
  testv(@Body('reference') reference: string) {
    return this.productService.testv(reference);
  }

  // @Post('web')
  // async handleWebhook(@Body() body: any) {
  //   console.log('Webhook event data:', body);
  //   return { status: 'success' };
  // }

  @Get('')
  getUsers() {
    return this.productService.getProducts();
  }

  @Get('collection')
  getCollections() {
    return this.productService.getCollections();
  }

  @Get('top')
  getTopProducts() {
    return this.productService.getTopProducts();
  }

  // users/:id
  @Get(':id')
  async getProdById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.productService.getProductById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  @Get('collection/:id')
  async getCollById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.productService.getCollById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  @Post('toggle')
  async toggle(@Body('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.productService.getCollById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return this.productService.toggleArchived(id); // Notice the parameter order, `amount` comes first in your service
  }

  @Post('stock')
  async updateStock(@Body('id') id: string, @Body('amount') quantitiy: number) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.productService.updateStock(id, quantitiy);
    if (!findUser) throw new HttpException('User not found', 404);
    return this.productService.toggleArchived(id); // Notice the parameter order, `amount` comes first in your service
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('id') id: string, @Body() updateProductDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const updatedUser = await this.productService.updateProduct(
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
    const deletedUser = await this.productService.deleteProduct(id);
    if (!deletedUser) throw new HttpException('User Not Found', 404);
    return;
  }
}
