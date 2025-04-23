import { useAppFetch } from '../hooks/useAppFetch';
import { ContactMeForm } from '../types/ContactMeForm';
import { BASE_API_ULR } from '../utils/constants';

export const useContactMeService = () => {
  const appFetch = useAppFetch();

  const sendMessage = async (data: ContactMeForm): Promise<void> => {
    const res = await appFetch(`${BASE_API_ULR}/message`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.json();
  };

  return { sendMessage };
};
