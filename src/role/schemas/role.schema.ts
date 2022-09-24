import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RoleDocument = Role & Document;

/* 
  RBAC - role-based access control
  first create roles; role =[ "user", "guest", "organization",  "super-admin" "global-super-admin"]
  next, create resource, add their roles_id and permissions
  finally create users and indicate their roles
*/
// https://blog.nextwebb.tech/role-based-access-control-rbac-for-nosql-db-in-nodejs
@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
