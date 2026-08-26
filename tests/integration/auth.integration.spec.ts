import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app.ts';
import {
  disconnectTestDatabase,
  resetTestDatabase
} from '../helpers/test-db.js';

describe('authentication API', () => {
  beforeAll(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('registers a new user successfully', async () => {
    const response = await api.post('/api/auth/register').send({
      email: 'new.user@example.com',
      password: 'NewUser123!',
      name: 'New User'
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('new.user@example.com');
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  it('rejects duplicate email registration', async () => {
    const response = await api.post('/api/auth/register').send({
      email: 'admin@example.com',
      password: 'Admin123!',
      name: 'Duplicate Admin'
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('logs in successfully', async () => {
    const response = await api.post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'Admin123!'
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.role).toBe('ADMIN');
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  it('rejects invalid password', async () => {
    const response = await api.post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'wrong-password'
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects protected endpoint without token', async () => {
    const response = await api.get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
