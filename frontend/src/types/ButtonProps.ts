export type ButtonProps = {
  onClick?: (e: React.MouseEvent) => void;
  type?: HTMLButtonElement['type'];
  isDisabled?: boolean;
  className?: string;
  isLoading?: boolean;
};
