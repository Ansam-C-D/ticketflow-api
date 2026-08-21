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

describe('status history API', () => {
  let agentToken: string;

  beforeAll(async () => {
    await resetTestDatabase();

    agentToken = await login('agent@example.com', 'Agent123!');
  });
  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('allows assignee agent changes status, creates status history get all status history', async () => {
    const responseStatusUpdate = await api
      .patch('/api/tickets/unable-to-reset-password/status')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'IN_PROGRESS' });

    expect(responseStatusUpdate.status).toBe(200);
    expect(responseStatusUpdate.body.data.status).toBe('IN_PROGRESS');

    const response = await api
      .get('/api/tickets/unable-to-reset-password/status-history')
      .set('Authorization', `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].toStatus).toBe('IN_PROGRESS');
  });
});
