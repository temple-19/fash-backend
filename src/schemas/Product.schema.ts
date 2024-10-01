import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class ProductQueryFilter {
  category?: string;

  color?: string;

  size?: string;

  sex?: string;

  collection?: string;
}

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sex: string; //men or female

  @Prop({ required: true })
  _collection: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: [String], required: true })
  color: string[];

  @Prop({ type: [String], required: true })
  size: string[];

  @Prop({ required: true })
  img_Url: string;

  @Prop({ type: [String], required: true })
  img_Arr_Url: string[];

  @Prop({ required: true, default: false })
  featured: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
