import { Role } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { signToken, verifyToken } from '../../src/utils/jwt.ts';

describe('jwt helpers', () => {
  it('round-trips the auth payload', () => {
    const token = signToken({
      userId: 'user-123',
      role: Role.ADMIN
    });

    expect(verifyToken(token)).toEqual({
      userId: 'user-123',
      role: Role.ADMIN
    });
  });
});
