export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const isAdmin = (role: string): boolean => role === ROLES.ADMIN;
export const isUser = (role: string): boolean => role === ROLES.USER; 