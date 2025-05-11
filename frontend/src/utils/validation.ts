import { z } from 'zod';

const getMinLengthValidationMsg = (min: number, field: string) =>
  `${field} must be at least ${min} characters.`;
const getMaxLengthValidationMsg = (max: number, field: string) =>
  `${field} cannot exceed ${max} characters.`;

const emailZodSchema = z
  .string()
  .email({ message: 'Please provide a valid email address.' })
  .min(1, { message: 'Email is required.' });

const firstNameValidation = z
  .string()
  .min(2, { message: getMinLengthValidationMsg(2, 'First name') })
  .max(100, { message: getMaxLengthValidationMsg(100, 'First name') });

const lastNameValidation = z
  .string()
  .min(2, { message: getMinLengthValidationMsg(2, 'Last name') })
  .max(100, { message: getMaxLengthValidationMsg(100, 'Last name') });

const passwordValidation = z
  .string()
  .min(4, { message: getMinLengthValidationMsg(4, 'Password') })
  .max(100, { message: getMaxLengthValidationMsg(100, 'Password') });

const messageValidation = z
  .string()
  .min(2, { message: getMinLengthValidationMsg(2, 'Message') })
  .max(1024, { message: getMaxLengthValidationMsg(1024, 'Message') });

export const contactMeFormSchema = z.object({
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  email: emailZodSchema,
  message: messageValidation,
});

export const registerFormSchema = z.object({
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  email: emailZodSchema,
  password: passwordValidation,
});

export const loginFormSchema = z.object({
  password: passwordValidation,
  email: emailZodSchema,
});
