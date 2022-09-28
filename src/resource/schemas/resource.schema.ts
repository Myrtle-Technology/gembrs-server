import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ResourceRole } from './resource-role.schema';

export type ResourceDocument = Resource & Document;
// https://stackoverflow.com/questions/62704600/mongoose-subdocuments-in-nest-js
@Schema({ timestamps: true })
export class Resource {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({
    type: [{ type: ResourceRole }],
  })
  resources_roles: ResourceRole[];
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);