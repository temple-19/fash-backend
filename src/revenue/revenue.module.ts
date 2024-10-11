import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Revenue, RevenueSchema } from 'src/schemas/Revenue.schema';
import { RevenueService } from './revenue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Revenue.name,
        schema: RevenueSchema,
      },
    ]),
  ],
  providers: [RevenueService],
})
export class RevenueModule {}
