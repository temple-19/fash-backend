import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Product {
  // @Prop({
  //   type: String,
  //   default: uuidv4, // Generates a uuid by default
  //   unique: true, // Ensures that this id is unique
  // })
  // id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sex: string; //men or female

  @Prop({ required: true })
  collection: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], required: true })
  color: string[];

  @Prop({ required: true })
  img_Url: number;

  @Prop({ type: [String], required: true })
  img_Arr_Url: string[];

  @Prop({ required: true, default: false })
  featured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
