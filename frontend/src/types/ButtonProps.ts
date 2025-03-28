export type ButtonProps = {
  text: string;
  onClick: (e: React.MouseEvent) => void;
  isDisabled?: boolean;
  className?: string;
};
