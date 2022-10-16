import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RenewalPeriodDuration } from '../enums/renewal-period-duration.enum';

@Schema()
export class RenewalPeriod {
  @ApiProperty()
  @Prop()
  length: number;

  @ApiProperty({
    description: `\`${Object.values(RenewalPeriodDuration).join('` or `')}\``,
  })
  @Prop({
    type: String,
    enum: RenewalPeriodDuration,
    default: RenewalPeriodDuration.Never,
  })
  duration: RenewalPeriodDuration;
}

export const RenewalPeriodSchema = SchemaFactory.createForClass(RenewalPeriod);
