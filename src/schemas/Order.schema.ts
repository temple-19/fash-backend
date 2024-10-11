import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  phone_Number: number;

  @Prop({ required: false })
  orderStatus: string; //paid, returnded/refund ...

  @Prop({ required: true })
  email: string;

  @Prop({ unique: true })
  reference: string;

  @Prop({
    required: true,
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: Number, required: true },
      country: { type: String, required: true },
    },
  })
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
        size: { type: String, required: true },
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
    size: string;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
