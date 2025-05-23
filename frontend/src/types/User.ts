import { Role } from './Roles';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};
