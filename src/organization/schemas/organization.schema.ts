import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { User } from 'src/user/schemas/user.schema';

// export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  siteName: string;

  @ApiProperty()
  @Prop()
  contactEmail: string;

  @ApiProperty()
  @Prop()
  contactPhone: string;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop()
  logoUrl: string;

  @ApiProperty()
  @Prop()
  address: string;

  @ApiProperty()
  @Prop()
  state: string;

  @ApiProperty()
  @Prop()
  country: string;

  @ApiProperty()
  @Prop()
  currency: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.plugin(mongoosePagination);
