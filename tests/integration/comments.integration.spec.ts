import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app.ts';
import {
  disconnectTestDatabase,
  resetTestDatabase
} from '../helpers/test-db.ts';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('comment API', () => {
  let agentToken: string;
  let agentId: string;

  beforeAll(async () => {
    await resetTestDatabase();
    agentToken = await login('agent@example.com', 'Agent123!');
    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${agentToken}`);

    agentId = usersResponse.body.data[0].id as string;
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });
  it('create a comment', async () => {
    const response = await api
      .post('/api/tickets/unable-to-reset-password/comments')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ body: 'Will look into it' });
    expect(response.status).toBe(201);
    expect(response.body.data.body).toBe('Will look into it');
  });
  it('retrieve ticket comments', async () => {
    const response = await api
      .get('/api/tickets/unable-to-reset-password/comments')
      .set('Authorization', `Bearer ${agentToken}`);
    expect(response.status).toBe(200);
  });
});
