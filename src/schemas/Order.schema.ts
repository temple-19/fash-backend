import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

@Schema()
export class Order {
  // @Prop({
  //   type: String,
  //   default: uuidv4, // Generates a uuid by default
  //   unique: true, // Ensures that this id is unique
  // })
  // id: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  phone_Number: number;

  @Prop({ required: true })
  orderStatus: string; //paid, refund,....

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        color: { type: String, required: true },
      },
    ],
    required: true,
  })
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    color: string;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
