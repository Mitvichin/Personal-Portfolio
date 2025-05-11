import { PropsWithChildren } from 'react';
import { ButtonProps } from '../../types/ButtonProps';
import { GET_BUTTON_CLASS_NAME } from '../../utils/constants';
import { LoadingSpinner } from './LoadingSpinner';

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  type = 'button',
  onClick,
  isDisabled = false,
  className: classNameProp = '',
  isLoading = false,
  ...rest
}) => {
  const className = GET_BUTTON_CLASS_NAME(classNameProp);

  return (
    <button
      {...rest}
      type={type}
      role="button"
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
