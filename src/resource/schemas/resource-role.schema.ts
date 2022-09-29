import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';

// export type ResourceRoleDocument = ResourceRole & Document;

@Schema({ timestamps: true })
export class ResourceRole extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop()
  rCreate: boolean;

  @Prop()
  rDelete: boolean;

  @Prop()
  rUpdate: boolean;

  @Prop()
  rRead: boolean;
}

export const ResourceRoleSchema = SchemaFactory.createForClass(ResourceRole);
