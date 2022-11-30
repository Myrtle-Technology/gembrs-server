import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { Organization } from 'src/organization/schemas/organization.schema';
import { User } from 'src/user/schemas/user.schema';
import { TemplateType } from '../enums/template-type.enum';

// export type TemplateDocument = Template & Document;

@Schema({ timestamps: true })
export class Template extends Document {
  @ApiProperty()
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  html: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: TemplateType,
    default: TemplateType.EMAIL,
  })
  type: TemplateType;

  @ApiProperty()
  @Prop()
  publishedAt: Date;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

TemplateSchema.plugin(mongoosePagination);
