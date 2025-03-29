import { useAppFetch } from "../hooks/useAppFetch";
import { ContactMeForm } from "../types/ContactMeForm";

export const useContactMeService = () => {
  const appFetch = useAppFetch();

  const sendMessage = async (data: ContactMeForm) => {
    const res = await appFetch("/api/message", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res.json();
  };

  return { sendMessage };
};
