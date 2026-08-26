import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import { api } from '../helpers/test-app.ts';
import {
  disconnectTestDatabase,
  resetTestDatabase
} from '../helpers/test-db.ts';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('status history API', () => {
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
  it('retrieve a tickets status history', async () => {
    const response = await api
      .get('/api/tickets/unable-to-reset-password/status-history')
      .set('Authorization', `Bearer ${agentToken}`);
    expect(response.status).toBe(200);
  });
});
