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
import { AdminService } from './admin.service';
import mongoose from 'mongoose';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // @Post('create')
  // @UsePipes(new ValidationPipe())
  // createUser(@Body() CreateAdminDto) {
  //   console.log(CreateAdminDto);
  //   return this.adminService.createUser(CreateAdminDto);
  // }

  @Post('sign-in')
  @UsePipes(new ValidationPipe())
  loginUser(@Body() body) {
    return this.adminService.login(body);
  }

  // users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.adminService.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('id') id: string, @Body() updateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const updatedUser = await this.adminService.updateUser(id, updateUserDto);
    if (!updatedUser) throw new HttpException('User Not Found', 404);
    return updatedUser;
  }
}
