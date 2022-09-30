import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { Member } from 'src/member/schemas/member.schema';
// import { DuplicateFieldError } from 'src/shared/errors/duplicate-field.error';

// export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

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

  @Prop(Boolean)
  verifiedEmail: boolean;

  @Prop(Boolean)
  verifiedPhone: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }] })
  memberships: Member[];
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
