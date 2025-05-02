import { Message } from './Message';

export type TableProps = {
  messages: Message[];
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onMessageDelete: (id: string) => Promise<boolean>;
  isLoading: boolean;
};
