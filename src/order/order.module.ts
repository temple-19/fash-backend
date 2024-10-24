import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from 'src/schemas/Order.schema';
import { Revenue, RevenueSchema } from 'src/schemas/Revenue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Revenue.name,
        schema: RevenueSchema,
      },
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
