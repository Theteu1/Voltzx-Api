import { User } from '@prisma/client';

export type AuthenticatedUser = User & {
  company?: { id: string };
  landOwner?: { id: string };
  investor?: { id: string };
};