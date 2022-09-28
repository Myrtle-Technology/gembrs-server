import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';

// export type ResourceRoleDocument = ResourceRole & Document;

@Schema({ timestamps: true })
export class ResourceRole {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' })
  role: Role;

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

export const ResourceRoleSchema = SchemaFactory.createForClass(ResourceRole);
