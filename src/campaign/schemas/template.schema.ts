import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Template extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content: Record<string, unknown>;

  @Prop()
  emailTemplate: string;

  @Prop()
  smsTemplate: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
export const TemplateSchema = SchemaFactory.createForClass(Template);

TemplateSchema.plugin(mongoosePagination);
