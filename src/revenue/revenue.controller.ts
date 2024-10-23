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
}
