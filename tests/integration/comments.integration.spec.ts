import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app';
import { disconnectTestDatabase, resetTestDatabase } from '../helpers/test-db';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('/:id/comments', () => {
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

    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${adminToken}`);
    agentId = usersResponse.body.data[0].id as string;
  });
  it('create a comment', async () => {
    const response = await api
      .post(`/api/tickets/cannot-update-profile/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'Working on this now.'
      });
    expect(response.status).toBe(201);
    expect(response.body.data.body).toBe('Working on this now.');
  });
  it('list comments for a ticket with pagination', async () => {
    const res = await api
      .get(`/api/tickets/cannot-update-profile/comments?page=1&limit=3`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.status).toBe(200);
  });
});
