import { useState } from 'react';
import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { toast } from 'react-toastify';
import { loginFormSchema } from '../utils/validation';
import { Button } from '../components/Button';
import { useAuthService } from '../services/auth';
import { useNavigate } from 'react-router';
import { routes } from '../router';
import { LoginForm } from '../types/LoginForm';
import { useAuthContext } from '../providers/auth/AuthContext';
import { AppError } from '../types/AppError';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;
const intialFormState: LoginForm = {
  email: '',
  password: '',
};

export const Login: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const { login } = useAuthService();
    const navigate = useNavigate();
    const { setUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isValid: isFormValid },
    } = useForm<LoginForm>({
      defaultValues: intialFormState,
      mode: 'onChange',
      resolver: zodResolver(loginFormSchema),
    });

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
      try {
        setIsLoading(true);

        const user = await login(data);
        setUser(user);
        navigate(`/${routes.experience}`);
      } catch (err: unknown) {
        if (err instanceof AppError) {
          toast.error(err.message);
          return;
        }

        toast.error('Login failed. Please try again!');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="w-full py-2 min-h-screen flex flex-col place-items-center justify-center gap-4">
        <p className="text-xl md:text-2xl font-medium">Log in</p>
        <form
          className="flex-0 text-[14px] w-3/4 md:w-[2/4] max-w-[400px] sm:text-base flex flex-col gap-6 justify-center border-3 border-dotted p-4 rounded-2xl bg-white shadow-xl"
          onDoubleClick={(e) =>
            redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)
          }
        >
          <div className="flex flex-col gap-3 md:gap-6">
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
                className={`bg-gray-50 border border-gray-300 ${errors.email?.message ? 'outline-red-400 border-red-400' : ''} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-[12px] font-medium text-red-400 py-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                className={`bg-gray-50 border border-gray-300 ${errors.password?.message ? 'outline-red-400 border-red-400' : ''} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="Password"
                required
              />
              {errors.password && (
                <p className="text-[12px] font-medium text-red-400 py-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <Button
              isDisabled={!isFormValid}
              onClick={handleSubmit(onSubmit)}
              className="self-start px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-300"
              text="Log in"
            />
            {isLoading && <div className="float-end align-middle">Loading</div>}
          </div>
        </form>
      </div>
    );
  });
