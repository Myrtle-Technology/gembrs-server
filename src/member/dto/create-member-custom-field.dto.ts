import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberCustomFieldDto {
  @ApiProperty({ description: 'the id of the custom field' })
  field: string;
  @ApiProperty({
    description:
      'the value of the field, it could be a number, string, array or even an object',
    type: String,
  })
  value: any;
}
