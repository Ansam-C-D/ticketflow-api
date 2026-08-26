import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app';
import { disconnectTestDatabase, resetTestDatabase } from '../helpers/test-db';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('/:id/status-history', () => {
  let adminToken: string;
  let agentToken: string;
  let user1Token: string;
  let user2Token: string;
  let agentId: string;

  beforeAll(async () => {
    await resetTestDatabase();

    adminToken = await login('admin@example.com', 'Admin123!');
    agentToken = await login('agent@example.com', 'Agent123!');
    user1Token = await login('user2@example.com', 'User234!');
    user2Token = await login('user2@example.com', 'User234!');

    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${adminToken}`);
    agentId = usersResponse.body.data[0].id as string;
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('list status history for a ticket with pagination', async () => {
    const res = await api
      .get(`/api/tickets/cannot-update-profile/status-history?page=1&limit=3`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(200);
  });
});
