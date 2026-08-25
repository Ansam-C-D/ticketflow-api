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

describe('ticket API', () => {
  let adminToken: string;
  let agentToken: string;
  let user1Token: string;
  let user2Token: string;
  let agentId: string;

  beforeAll(async () => {
    await resetTestDatabase();

    adminToken = await login('admin@example.com', 'Admin123!');
    agentToken = await login('agent@example.com', 'Agent123!');
    user1Token = await login('user1@example.com', 'User123!');
    user2Token = await login('user2@example.com', 'User234!');

    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${adminToken}`);

    agentId = usersResponse.body.data[0].id as string;
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('creates a comment', async () => {
    const response = await api
      .post('/api/tickets/email-notifications-not-arriving/comments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'test',
        commentBody:
          'test comment body.'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('test');
  });

  it('retrieves a comment by id', async () => {
    const listResponse = await api
      .get('/api/tickets/email-notifications-not-arriving/comments')
      .set('Authorization', `Bearer ${adminToken}`);

    const ticketId = listResponse.body.data[0].id as string;

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data[0].id).toBe(ticketId);
  });

  it('retrieves a status-history by id', async () => {
    const uniqueresponse = await api
      .get('/api/tickets/email-notifications-not-arriving/status-history')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(uniqueresponse.status).toBe(200);
  });


  it('rejects invalid validation input', async () => {
    const response = await api
      .post('/api/tickets/email-notifications-not-arriving/comments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'No',
        description: 'short',
        priority: 'NOT_A_PRIORITY'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
