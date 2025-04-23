import { ContactMeForm } from '../types/ContactMeForm';
import { LoginForm } from '../types/LoginForm';
import { RegisterForm } from '../types/RegisterForm';
import { StringValidationResult } from '../types/utils/StringValidationResult';

export const isEmail = (email: string): boolean => {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) {
    return true;
  }

  return false;
};

export const validateFormData = <T extends Record<string, string>>(
  data: T,
  validationMap: Record<keyof T, (value: string) => StringValidationResult>,
): boolean => {
  for (const k in data) {
    const key = k as keyof T;
    const { isValid } = validationMap[key](data[key]);

    if (!isValid) return false;
  }

  return true;
};

export const validateStringLength = (
  val: string,
  min: number,
  max: number,
  name: string,
): StringValidationResult => {
  if (val.length < min)
    return { isValid: false, errMsg: `${name} is too short` };
  if (val.length > max)
    return { isValid: false, errMsg: `${name} is too long` };

  return { isValid: true, errMsg: '' };
};

export const contactMeFormFieldValidation: Record<
  keyof ContactMeForm,
  (value: string) => StringValidationResult
> = {
  firstName: (val) => validateStringLength(val, 2, 100, 'First name'),
  lastName: (val) => validateStringLength(val, 2, 100, 'Last name'),
  email: (val) =>
    isEmail(val)
      ? { isValid: true }
      : { isValid: false, errMsg: 'Invalid email' },
  message: (val) => validateStringLength(val, 2, 1024, 'Message'),
};

export const registerFormFieldValidation: Record<
  keyof RegisterForm,
  (value: string) => StringValidationResult
> = {
  firstName: (val) => validateStringLength(val, 2, 100, 'First name'),
  lastName: (val) => validateStringLength(val, 2, 100, 'Last name'),
  email: (val) =>
    isEmail(val)
      ? { isValid: true }
      : { isValid: false, errMsg: 'Invalid email' },
  password: (val) => validateStringLength(val, 4, 100, 'Password'),
};

export const loginFormFieldValidation: Record<
  keyof LoginForm,
  (value: string) => StringValidationResult
> = {
  email: (val) =>
    isEmail(val)
      ? { isValid: true }
      : { isValid: false, errMsg: 'Invalid email' },
  password: (val) => validateStringLength(val, 4, 100, 'Password'),
};
