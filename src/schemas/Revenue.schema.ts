import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Revenue {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true })
  month: string; // e.g., 'JAN', 'FEB', etc.

  @Prop({ required: true })
  year: number; // e.g., 2024

  @Prop({ default: 0 })
  revenue: number; // Revenue for that month

  @Prop({ default: 0 })
  totalOrder: number;
}

export const RevenueSchema = SchemaFactory.createForClass(Revenue);
