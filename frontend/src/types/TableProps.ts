import { Message } from './Message';

export type TableProps = {
  messages: Message[];
  onPageChange: (page: number) => void;
};
