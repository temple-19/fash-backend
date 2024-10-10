import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AdminModule,
    ProductModule,
    AuthModule,
    OrderModule,
  ],
})
export class AppModule {}
