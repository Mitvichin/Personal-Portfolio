import { useRef, useState } from 'react';
import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { useContactMeService } from '../services/contact-me';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { toast } from 'react-toastify';
import { ContactMeForm } from '../types/ContactMeForm';
import {
  contactMeFormFieldValidation,
  validateFormData,
} from '../utils/validation';
import { Button } from '../components/Button';
import { AppError } from '../types/AppError';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;
const intialFormState: ContactMeForm = {
  firstName: '',
  lastName: '',
  email: '',
  message: "",
};

export const ContanctMe: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { sendMessage } = useContactMeService();
    const debouceId = useRef<NodeJS.Timeout>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ContactMeForm>(intialFormState);
    const [formData, setFormData] = useState<ContactMeForm>(intialFormState);
    const [isFormValid, setIsFormValid] = useState(false);

    const updateFormState = (key: keyof ContactMeForm, value: string) => {
      const { isValid, errMsg } = contactMeFormFieldValidation[key](value);

      clearTimeout(debouceId.current);

      if (!isValid) {
        debouceId.current = setTimeout(() => {
          setErrors((prev) => ({ ...prev, [key]: errMsg }));
        }, 350);
      } else {
        setErrors((prev) => ({ ...prev, [key]: '' }));
      }

      setFormData((prev) => {
        const newState = { ...prev, [key]: value };

        setIsFormValid(
          validateFormData(newState, contactMeFormFieldValidation),
        );

        return newState;
      });
    };

    const handleSubmit = async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        await sendMessage(formData);
        setErrors(intialFormState);
        setFormData(intialFormState);
        setIsFormValid(true);
        toast.success('Your message was sent successfully!');
      } catch (err: unknown) {
        if (err instanceof AppError) {
          toast.error(err.message);
          return;
        }

        toast.error('Sending your message failed. Please try again!');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form
        className="flex-1 text-[14px] sm:text-base flex flex-col justify-between"
        onDoubleClick={(e) =>
          redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)
        }
      >
        <div className="flex flex-col gap-3 md:gap-6">
          <div className="grid gap-3 md:gap-6  md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First name <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => updateFormState('firstName', e.target.value)}
                value={formData.firstName}
                name="firstName"
                type="text"
                id="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required
              />
              {errors.firstName && (
                <p className="text-[12px] font-medium text-red-400">
                  Field {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => updateFormState('lastName', e.target.value)}
                value={formData.lastName}
                type="text"
                id="lastName"
                name="lastName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Doe"
                required
              />
              {errors.lastName && (
                <p className="text-[12px] font-medium text-red-400">
                  Field {errors.lastName}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => updateFormState('email', e.target.value)}
              value={formData.email}
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="john.doe@company.com"
              required
            />
            {errors.email && (
              <p className="text-[12px] font-medium text-red-400">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Message<span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => updateFormState('message', e.target.value)}
              id="message"
              name="message"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none h-50 max-h-[150px]"
              placeholder="Message to Ilia Mitvichin"
              required
            />
            {errors.message && (
              <p className="text-[12px] font-medium text-red-400">
                Field {errors.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <Button
            isDisabled={!isFormValid}
            onClick={handleSubmit}
            className="self-start px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-300"
            text="Submit"
          />
          {isLoading && <div className="float-end align-middle">Loading</div>}
        </div>
      </form>
    );
  });
