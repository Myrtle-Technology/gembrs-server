import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { uniq } from 'lodash';
import mongoose, { Document } from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Role } from 'src/role/schemas/role.schema';
import { Permission } from '../enums/permission.enum';
import { Resource } from './resource.schema';

// export type ResourceRoleDocument = ResourceRole & Document;

@Schema({ timestamps: true })
export class ResourceRole extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  })
  resource: Resource;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ required: true, type: [String], enum: Permission })
  permissions: Permission[];
}

export const ResourceRoleSchema = SchemaFactory.createForClass(ResourceRole);

ResourceRoleSchema.pre('save', function (next) {
  this.permissions = uniq(this.permissions);
  next();
});
ResourceRoleSchema.pre('findOneAndUpdate', function (next) {
  this.set('permissions', uniq(this.get('permissions')));
  next();
});
