import { ContactMe } from "../types/ContactMe";
import { StringValidationResult } from "../types/utils/StringValidationResult";

export const isEmail = (email: string): boolean => {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
};

export const contactMeFieldValidation: Record<
  keyof ContactMe,
  (value: string) => StringValidationResult
> = {
  firstName: (val) => validateStringLength(val, 2, 100, "First name"),
  lastName: (val) => validateStringLength(val, 2, 100, "Last name"),
  email: (val) =>
    isEmail(val)
      ? { isValid: true }
      : { isValid: false, errMsg: "Invalid email" },
  message: (val) => validateStringLength(val, 2, 1024, "Message"),
};

export const validateStringLength = (
  val: string,
  min: number,
  max: number,
  name: string
): StringValidationResult => {
  if (val.length < min)
    return { isValid: false, errMsg: `${name} is too short` };
  if (val.length > max)
    return { isValid: false, errMsg: `${name} is too long` };

  return { isValid: true, errMsg: "" };
};

export const validateContactMeForm = (data: ContactMe): boolean => {
  for (const k in data) {
    const key = k as keyof ContactMe;
    const { isValid } = contactMeFieldValidation[key](data[key]);

    if (!isValid) return false;
  }

  return true;
};
