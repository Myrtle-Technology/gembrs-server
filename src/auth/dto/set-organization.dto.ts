import { IsString } from 'class-validator';

export class SetOrganizationDto {
  @IsString()
  organization: string;
}
