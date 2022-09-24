import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// export type ResourceRoleDocument = ResourceRole & Document;

@Schema({ timestamps: true })
export class ResourceRole {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
  roleId: string;

  // @Prop()
  // roleName: string;

  @Prop()
  create: boolean;

  @Prop()
  delete: boolean;

  @Prop()
  update: boolean;

  @Prop()
  read: boolean;
}

export const imageVariantSchema = SchemaFactory.createForClass(ResourceRole);
