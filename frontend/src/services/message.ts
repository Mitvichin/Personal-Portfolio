import { useCallback } from 'react';
import { useAppFetch } from '../hooks/useAppFetch';
import { Message } from '../types/Message';
import { BASE_API_ULR } from '../utils/constants';

export const useMessageService = () => {
  const appFetch = useAppFetch();

  const sendMessage = async (data: Message): Promise<void> => {
    const res = await appFetch(`${BASE_API_ULR}/message`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.json();
  };

  const getMessages = useCallback(
    async (page: number, limit: number): Promise<{ messages: Message[] }> => {
      const res = await appFetch(
        `${BASE_API_ULR}/message?page=${page}&limit=${limit}`,
        {
          method: 'GET',
        },
      );

      return res.json();
    },
    [appFetch],
  );

  return { sendMessage, getMessages };
};
