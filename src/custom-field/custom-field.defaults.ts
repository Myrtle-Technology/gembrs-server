import { CustomFieldType } from './enums/custom-field-type.enum';
import { CustomField } from './schemas/custom-field.schema';

export class CustomFieldDefaults {
  static MembershipId = new CustomField({
    name: 'membership',
    label: 'Membership Level',
    type: CustomFieldType.Text,
    required: true,
    order: -1,
    attributes: {
      hidden: true,
    },
  });
  static FirstName = new CustomField({
    name: 'firstName',
    label: 'First Name',
    type: CustomFieldType.Text,
    required: true,
    order: 1,
  });
  static LastName = new CustomField({
    name: 'lastName',
    label: 'Last Name',
    type: CustomFieldType.Text,
    required: true,
    order: 2,
  });
  static Email = new CustomField({
    name: 'email',
    label: 'Email',
    type: CustomFieldType.Email,
    required: false, // the service will make it required
    order: 3,
    attributes: {
      placeholder: 'example@email.com',
    },
  });
  static PhoneNumber = new CustomField({
    name: 'phone',
    label: 'Phone Number',
    type: CustomFieldType.Tel,
    required: false, // the service will make it required
    order: 4,
  });
  static Password = new CustomField({
    name: 'password',
    label: 'Password',
    type: CustomFieldType.Password,
    required: true,
    order: 5,
  });
  static ConfirmPassword = new CustomField({
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: CustomFieldType.Password,
    required: true,
    order: 6,
  });
}
