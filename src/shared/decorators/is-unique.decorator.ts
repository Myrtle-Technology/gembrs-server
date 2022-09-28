import { registerDecorator, ValidationOptions } from 'class-validator';
import mongoose from 'mongoose';

export function IsUnique(
  model: IDoesNotExistParams,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${model.name} with the specified ${propertyName} already exists, please choose another one`,
        ...validationOptions,
      },
      validator: {
        async validate(value: any) {
          await mongoose.connect(process.env.MONGODB_URI);
          const organization = await mongoose
            .model(model.name, model.schema)
            .findOne({ [propertyName]: value });
          return !organization;
        },
      },
    });
  };
}

export interface IDoesNotExistParams {
  name: string;
  schema?: mongoose.Schema;
}
