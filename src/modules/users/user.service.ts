import type { Role } from '@prisma/client';
import { prisma } from '../../db/prisma.ts';

type UserListFilter = {
  role?: Role;
};

export class UserService {
  async listUsers(filter: UserListFilter) {
    const where = filter.role ? { role: filter.role } : {};

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }
}
