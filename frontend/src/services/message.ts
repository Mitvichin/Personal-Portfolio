import { useAppFetch } from '../hooks/useAppFetch';
import { ContactMeForm } from '../types/ContactMeForm';
import { BASE_API_ULR } from '../utils/constants';

export const useMessageService = () => {
  const appFetch = useAppFetch();

  const sendMessage = async (data: ContactMeForm): Promise<void> => {
    const res = await appFetch(`${BASE_API_ULR}/message`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.json();
  };

  const getMessages = async (page: number, limit: number): Promise<void> => {
    const res = await appFetch(
      `${BASE_API_ULR}/message?page=${page}&limit=${limit}`,
      {
        method: 'GET',
      },
    );

    console.log(await res.json());

    return;
  };

  return { sendMessage, getMessages };
};
