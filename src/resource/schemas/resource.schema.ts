import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ResourceRole, ResourceRoleSchema } from './resource-role.schema';

export type ResourceDocument = Resource & Document;
// https://stackoverflow.com/questions/62704600/mongoose-subdocuments-in-nest-js
@Schema({ timestamps: true })
export class Resource {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({
    type: [{ type: ResourceRoleSchema }],
  })
  resources_roles: ResourceRole[];
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
