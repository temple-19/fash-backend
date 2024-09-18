import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: false })
  Name?: string;

  @Prop({ required: false })
  avatarUrl?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
