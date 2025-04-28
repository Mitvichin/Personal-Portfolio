import { PropsWithChildren } from 'react';
import { ButtonProps } from '../types/ButtonProps';

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  type = 'button',
  onClick,
  isDisabled = false,
  className: classNameProp = '',
}) => {
  const className =
    `focus:outline-none font-medium rounded-lg text-sm text-center disabled:bg-gray-400 disabled:hover:bg-gray-400 hover:cursor-pointer hover:disabled:cursor-default ${classNameProp}`.trim();

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
};
