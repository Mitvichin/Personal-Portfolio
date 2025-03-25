import { ContactMe } from "../types/ContactMe";
import { appFetch } from "../utils/appFetch";

export const sendMessage = async (data: ContactMe) => {
  try {
    const res = await appFetch("/api/message", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong! Try again later!");
  }
};
