import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
