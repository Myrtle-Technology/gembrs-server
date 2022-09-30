import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';
import { Permission } from '../enums/permission.enum';

// export type ResourceRoleDocument = ResourceRole & Document;

@Schema({ timestamps: true })
export class ResourceRole extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ type: [String], enum: Permission })
  permissions: Permission[];
}

export const ResourceRoleSchema = SchemaFactory.createForClass(ResourceRole);
