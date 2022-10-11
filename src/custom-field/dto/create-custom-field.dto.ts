import { CustomFieldPrivacy } from '../enums/custom-field-privacy';
import { CustomFieldType } from '../enums/custom-field-type.enum';
import { CustomFieldOption } from '../schemas/custom-field-option';

export class CreateCustomFieldDto {
  name: string;
  label: string;
  type: CustomFieldType;
  options: CustomFieldOption[];
  required: boolean;
  order: number;
  organization: string;
  privacy: CustomFieldPrivacy;
  attributes: Record<string, any>;
  // formId: number;
}
