export type ButtonProps = {
  text: string;
  onClick: (e: React.MouseEvent) => void;
  type?: HTMLButtonElement['type'];
  isDisabled?: boolean;
  className?: string;
};
