import { ReactNode } from 'react';

export type ModalProps = {
  title: string;
  isOpened: boolean;
  onClose: () => void;
  footerElements?: ReactNode;
};
