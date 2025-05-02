export const Role = {
  ADMIN: 'admin',
  USER: 'user',
  EDITOR: 'editor',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
