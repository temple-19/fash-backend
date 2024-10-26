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
import { RevenueService } from './revenue.service';
import mongoose from 'mongoose';

@Controller('rev')
export class RevenueController {
  constructor(private revService: RevenueService) {}

  @Get('')
  getUsers() {
    return this.revService.getRev();
  }

  @Post('')
  async createRev(@Body() createRevDto: any) {
    // Call the service to save the data
    const result = await this.revService.createRev(createRevDto);
    return result;
  }
}
