export const BASE_API_ULR = import.meta.env.VITE_API_BASE_URL;
export const APP_CONTAINER_ID = 'app-container';
export const CSRF_TOKEN_COOKIE_NAME = 'personal_portfolio_csrf_token';
export const UNKNOW_ERROR_MESSAGE = 'Something went wrong! Try again later!';
export const GET_BUTTON_CLASS_NAME = (className: string = '') =>
  `relative focus:outline-none font-medium rounded-lg text-sm text-center disabled:bg-gray-400 hover:cursor-pointer hover:disabled:cursor-default px-2 py-1 border-1 border-gray-200 shadow-md hover:scale-110 disabled:hover:scale-100 ${className}`.trim();
