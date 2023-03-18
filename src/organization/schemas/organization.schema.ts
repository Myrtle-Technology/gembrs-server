import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { User } from 'src/user/schemas/user.schema';

// export type OrganizationDocument = Organization & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
})
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

OrganizationSchema.virtual('membersCount', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'organization',
  count: true,
});

OrganizationSchema.plugin(mongoosePagination);

OrganizationSchema.index({ '$**': 'text' });
