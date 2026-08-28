import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app.js';
import {
  disconnectTestDatabase,
  resetTestDatabase
} from '../helpers/test-db.js';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('Comment API', () => {
  let adminToken: string;
  let _agentToken: string;
  let user1Token: string;
  let _user2Token: string;
  let _agentId: string;

  beforeAll(async () => {
    await resetTestDatabase();

    adminToken = await login('admin@example.com', 'Admin123!');
    _agentToken = await login('agent@example.com', 'Agent123!');
    user1Token = await login('user1@example.com', 'User123!');
    _user2Token = await login('user2@example.com', 'User234!');

    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${adminToken}`);

    _agentId = usersResponse.body.data[0].id as string;
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('Creates a comment', async () => {
    const response = await api
      .post('/api/comments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        ticketId: 'unable-to-reset-password',
        body: 'I have looked at your account and found no issues'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.body).toBe(
      'I have looked at your account and found no issues'
    );
  });
});
