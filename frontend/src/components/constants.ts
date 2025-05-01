export const GET_BUTTON_CLASS_NAME = (className: string = '') =>
  `relative focus:outline-none font-medium rounded-lg text-sm text-center disabled:bg-gray-400 hover:cursor-pointer hover:disabled:cursor-default px-2 py-1 border-1 border-gray-200 shadow-md hover:scale-110 disabled:hover:scale-100 ${className}`.trim();
