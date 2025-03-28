import { ButtonProps } from "../types/ButtonProps";

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  isDisabled = false,
  className: classNameProp = "",
}) => {
  const className =
    `focus:outline-none font-medium rounded-lg text-sm text-center disabled:bg-gray-400 disabled:hover:bg-gray-400 hover:cursor-pointer hover:disabled:cursor-default ${classNameProp}`.trim();

  return (
    <button disabled={isDisabled} onClick={onClick} className={className}>
      {text}
    </button>
  );
};
