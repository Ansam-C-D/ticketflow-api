import { api } from '../helpers/test-app';
import { disconnectTestDatabase, resetTestDatabase } from '../helpers/test-db';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('history api', () => {
  let adminToken: string;
  let agentToken: string;
  let user2Token: string;
  beforeAll(async () => {
    await resetTestDatabase();
    await resetTestDatabase();
    adminToken = await login('admin@example.com', 'Admin123!');
    user2Token = await login('user2@example.com', 'User234!');
    agentToken = await login('agent@example.com', 'Agent123!');
  });
  afterAll(async () => {
    await disconnectTestDatabase();
  });
  it('list history', async () => {
    const response = await api
      .get('/api/tickets/unable-to-reset-password/history')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });
  it('unauthorized history access', async () => {
    const response = await api
      .get('/api/tickets/unable-to-reset-password/history')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });
  it('automatically log  to history on status change', async () => {
    const response = await api
      .patch('/api/tickets/unable-to-reset-password/status')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'IN_PROGRESS' });

    const historyResponse = await api
      .get('/api/tickets/unable-to-reset-password/history')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('IN_PROGRESS');

    expect(historyResponse.body.data).toContainEqual(
      expect.objectContaining({
        fromStatus: 'OPEN',
        toStatus: 'IN_PROGRESS'
      })
    );
  });
});
