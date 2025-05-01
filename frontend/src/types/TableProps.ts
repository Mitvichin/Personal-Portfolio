import { Message } from './Message';

export type TableProps = {
  messages: Message[];
  totalPages: number;
  onPageChange: (page: number) => void;
};
