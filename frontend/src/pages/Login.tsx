import { useRef, useState } from "react";
import { withRedirectionToSourceFiles } from "../decorators/withRedirectionToSourceFile";
import { WithRedirectionToSourceFileProps } from "../types/WithRedirectionToSourceFileProps";
import { toast } from "react-toastify";
import {
  loginFormFieldValidation,
  validateFormData,
} from "../utils/validation";
import { Button } from "../components/Button";
import { login } from "../services/auth";
import { useNavigate } from "react-router";
import { routes } from "../router";
import { LoginForm } from "../types/LoginForm";

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;
const intialFormState: LoginForm = {
  email: "",
  password: "",
};

export const Login: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    const navigate = useNavigate();
    const debouceId = useRef<NodeJS.Timeout>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<LoginForm>(intialFormState);
    const [formData, setFormData] = useState<LoginForm>(intialFormState);
    const [isFormValid, setIsFormValid] = useState(false);

    const updateFormState = (key: keyof LoginForm, value: string) => {
      const { isValid, errMsg } = loginFormFieldValidation[key](value);

      clearTimeout(debouceId.current);

      if (!isValid) {
        debouceId.current = setTimeout(() => {
          setErrors((prev) => ({ ...prev, [key]: errMsg }));
        }, 350);
      } else {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }

      setFormData((prev) => {
        const newState = { ...prev, [key]: value };

        setIsFormValid(validateFormData(newState, loginFormFieldValidation));

        return newState;
      });
    };

    const handleSubmit = async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        await login(formData);
        setErrors(intialFormState);
        setFormData(intialFormState);
        navigate(`/${routes.experience}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }

        toast.error("Login failed. Please try again!");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="w-full py-2 min-h-screen flex flex-col place-items-center justify-center gap-4">
        <p className="text-xl md:text-2xl font-medium">Register</p>
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
                onChange={(e) => updateFormState("email", e.target.value)}
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
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.password}
                onChange={(e) => updateFormState("password", e.target.value)}
                id="password"
                name="password"
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Password"
                required
              />
              {errors.password && (
                <p className="text-[12px] font-medium text-red-400">
                  Field {errors.password}
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
      </div>
    );
  });
