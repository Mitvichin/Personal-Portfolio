import { Message } from '../Message';

export type MessageResponse = {
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
