import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RenewalPeriodDuration } from '../enums/renewal-period-duration.enum';

@Schema()
export class RenewalPeriod {
  @Prop()
  length: number;

  @Prop({
    type: String,
    enum: RenewalPeriodDuration,
    default: RenewalPeriodDuration.Never,
  })
  duration: RenewalPeriodDuration;
}

export const RenewalPeriodSchema = SchemaFactory.createForClass(RenewalPeriod);
