import { useCallback } from 'react';
import { useAppFetch } from '../hooks/useAppFetch';
import { ContactMeForm, Message } from '../types/Message';
import { BASE_API_ULR } from '../utils/constants';
import { GetPaginatedDataResponse } from '../types/api/GetPaginatedDataResponse';

export const useMessageService = () => {
  const appFetch = useAppFetch();

  const sendMessage = async (data: ContactMeForm): Promise<void> => {
    const res = await appFetch(`${BASE_API_ULR}/message`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.json();
  };

  const getMessages = useCallback(
    async (
      page: number,
      limit: number,
    ): Promise<{ messages: Message[]; totalPages: number; limit: number }> => {
      const res = await appFetch(
        `${BASE_API_ULR}/message?page=${page}&limit=${limit}`,
        {
          method: 'GET',
        },
      );

      const {
        data,
        pagination: { totalPages },
      }: GetPaginatedDataResponse<Message> = await res.json();

      return { messages: data, totalPages, limit };
    },
    [appFetch],
  );

  const deleteMessage = async (id: string): Promise<{ message: Message }> => {
    const res = await appFetch(`${BASE_API_ULR}/message`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    return res.json();
  };

  return { sendMessage, getMessages, deleteMessage };
};
