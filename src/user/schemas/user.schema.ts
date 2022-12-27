import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { Document } from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { ApiProperty } from '@nestjs/swagger';
// import { DuplicateFieldError } from 'src/shared/errors/duplicate-field.error';

// export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop()
  imageUrl: string;

  @ApiProperty()
  @Prop({
    lowercase: true,
    validate: async function (value) {
      if (!value) return true;
      if (!isEmail(value))
        throw new Error('Please enter a valid email address.');
      const user = await this.constructor.findOne({ email: value });
      if (user)
        throw new Error(
          'A user is already registered with this email address.',
        );
    },
    // match: [/.+@.+\..+/g, 'Please fill a valid email address'],
  })
  email: string;

  @ApiProperty()
  @Prop({
    validate: async function (value) {
      if (!value) return true;
      if (!isPhoneNumber(value))
        throw new Error(
          'Please enter a valid phone number. Ensure you include the country code',
        );
      const user = await this.constructor.findOne({ phone: value });
      if (user)
        throw new Error('A user is already registered with this phone number');
    },
  })
  phone: string;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop(Boolean)
  verifiedEmail: boolean;

  @ApiProperty()
  @Prop(Boolean)
  verifiedPhone: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual for user's full name
UserSchema.virtual('name').get(function () {
  let fullName = '';
  if (this.firstName && this.lastName) {
    fullName = `${this.firstName} ${this.lastName}`;
  }
  if (!this.firstName || !this.lastName) {
    fullName = this.firstName || this.lastName;
  }
  return fullName;
});

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = /{\s[a-zA-Z]+:/i.exec(error.message)[0].replace(/{|:| /g, '');
    next(new BadRequestException('The ' + field + ' already exists.'));
  } else {
    next(new BadRequestException('Bad input try again'));
  }
});
UserSchema.index({ '$**': 'text' });
UserSchema.plugin(mongoosePagination);
