export type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export type ContactMeForm = Omit<Message, 'id'>;
