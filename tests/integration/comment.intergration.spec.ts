import { api } from '../helpers/test-app';
import { disconnectTestDatabase, resetTestDatabase } from '../helpers/test-db';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('Comment API', () => {
  let adminToken: string;
  let user1Token: string;
  let user2Token: string;
  beforeAll(async () => {
    await resetTestDatabase();
    adminToken = await login('admin@example.com', 'Admin123!');
    user1Token = await login('user1@example.com', 'User123!');
    user2Token = await login('user2@example.com', 'User234!');
  });
  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('creates a comment', async () => {
    const response = await api
      .post('/api/tickets/unable-to-reset-password/comments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'cannot reset password'
      });
    expect(response.status).toBe(201);
    expect(response.body.data.body).toBe('cannot reset password');
    expect(response.body.data.ticketId).toBe('unable-to-reset-password');
  });
  it('list comments', async () => {
    const response = await api
      .get('/api/tickets/unable-to-reset-password/comments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({ ticketId: 'unable-to-reset-password' })
    );
  });
  it('unauthorized comment creation', async () => {
    const response = await api
      .get('/api/tickets/unable-to-reset-password/comments')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });
});
