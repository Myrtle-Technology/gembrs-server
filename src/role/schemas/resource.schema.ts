import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { ResourceRole } from './resource-role.schema';

// export type ResourceDocument = Resource & Document;
// https://stackoverflow.com/questions/62704600/mongoose-subdocuments-in-nest-js
@Schema({ timestamps: true })
export class Resource extends Document {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  slug: string;

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'ResourceRole' }],
  })
  resourcesRoles: ResourceRole[];
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
