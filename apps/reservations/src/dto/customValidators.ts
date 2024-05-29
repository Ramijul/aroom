import {
  ValidationArguments,
  ValidationDecoratorOptions,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function getBaseDecoratorOptions(
  object: Object,
  propertyName: string,
  validationOptions: ValidationOptions,
  constraints?: string[],
): Omit<ValidationDecoratorOptions, 'validator'> {
  return {
    target: object.constructor,
    propertyName: propertyName,
    constraints,
    options: validationOptions,
  };
}

export function IsDateAfterNow(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      ...getBaseDecoratorOptions(object, propertyName, validationOptions),
      name: 'isDateAfterNow',
      validator: {
        validate(value: any, _: ValidationArguments) {
          return typeof value === 'object' && (value as Date) > new Date();
        },
      },
    });
  };
}

export function IsDateAfterProperty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      ...getBaseDecoratorOptions(object, propertyName, validationOptions, [
        property,
      ]),
      name: 'isDateAfterNow',
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [constraintProperty] = args.constraints;
          const constraintPropertyValue = args.object[constraintProperty];
          return (
            typeof constraintPropertyValue === 'object' &&
            typeof value === 'object' &&
            (value as Date) > (constraintPropertyValue as Date)
          );
        },
      },
    });
  };
}
