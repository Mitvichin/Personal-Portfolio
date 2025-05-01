import { PropsWithChildren } from 'react';
import { ButtonProps } from '../types/ButtonProps';
import { LoadingSpinner } from './LoadingSpinner';
import { GET_BUTTON_CLASS_NAME } from '../utils/constants';

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  type = 'button',
  onClick,
  isDisabled = false,
  className: classNameProp = '',
  isLoading = false,
}) => {
  const className = GET_BUTTON_CLASS_NAME(classNameProp);

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
    >
      {isLoading ? (
        <LoadingSpinner className="absolute left-[50%] top-[50%] translate-[-50%]" />
      ) : null}
      <span className={`${isLoading ? 'opacity-0' : ''}`}>{children}</span>
    </button>
  );
};
