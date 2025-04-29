import { useState } from 'react';
import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { useMessageService } from '../services/message';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { toast } from 'react-toastify';
import { ContactMeForm } from '../types/ContactMeForm';

import { Button } from '../components/Button';
import { AppError } from '../types/AppError';
import { useForm, SubmitHandler } from 'react-hook-form';
import { contactMeFormSchema } from '../utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;
const intialFormState: ContactMeForm = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

export const ContanctMe: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { sendMessage } = useMessageService();
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isValid: isFormValid },
    } = useForm<ContactMeForm>({
      defaultValues: intialFormState,
      mode: 'onChange',
      resolver: zodResolver(contactMeFormSchema),
    });

    const onSubmit: SubmitHandler<ContactMeForm> = async (data) => {
      try {
        setIsLoading(true);
        await sendMessage(data);
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
        className="flex-1 text-[14px] sm:text-base flex flex-col justify-between gap-3 md:gap-6"
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
                {...register('firstName')}
                type="text"
                id="firstName"
                className={`bg-gray-50 border border-gray-500 ${errors.firstName?.message ? 'outline-red-400 border-red-400' : ''} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-[12px] font-medium text-red-400 py-1">
                  {errors.firstName.message}
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
                {...register('lastName')}
                type="text"
                id="lastName"
                className={`bg-gray-50 border border-gray-500 ${errors.lastName?.message ? 'outline-red-400 border-red-400' : ''} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-[12px] font-medium text-red-400 py-1">
                  {errors.lastName.message}
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
              {...register('email')}
              type="email"
              id="email"
              className={`bg-gray-50 border border-gray-500 ${errors.email?.message ? 'outline-red-400 border-red-400' : ''} text-gray-900 text-sm rounded-lg block w-full p-2.5 `}
              placeholder="john.doe@company.com"
            />
            {errors.email && (
              <p className="text-[12px] font-medium text-red-400 py-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Message<span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('message')}
              id="message"
              className={`bg-gray-50 border border-gray-500 ${errors.message?.message ? 'outline-red-400 border-red-400' : ''} text-gray-900 text-sm rounded-lg block w-full p-2.5 resize-none h-50 max-h-[150px] `}
              placeholder="Message to Ilia Mitvichin"
            />
            {errors.message && (
              <p className="text-[12px] font-medium text-red-400 py-1">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <Button
            isDisabled={!isFormValid}
            onClick={handleSubmit(onSubmit)}
            className="self-start px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-300"
          >
            Submit
          </Button>
          {isLoading && <div className="float-end align-middle">Loading</div>}
        </div>
      </form>
    );
  });
