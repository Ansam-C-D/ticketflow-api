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

describe('Comments API', () => {
  let adminToken: string;
  let agentToken: string;
  let user1Token: string;
  let user2Token: string;

  beforeAll(async () => {
    await resetTestDatabase();

    adminToken = await login('admin@example.com', 'Admin123!');
    agentToken = await login('agent@example.com', 'Agent123!');
    user1Token = await login('user1@example.com', 'User123!');
    user2Token = await login('user2@example.com', 'User234!');
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('creates a comment', async () => {
    const response = await api
      .post('/api/tickets/search-results-are-inconsistent/comments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'first some comment'
      });

    expect(response.body.data.body).toBe('first some comment');
    expect(response.body.data.ticketId).toBe('search-results-are-inconsistent');
  });

  it('view comments', async () => {
    const response = await api
      .get('/api/tickets/search-results-are-inconsistent/comments')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].body).toBe('first some comment');
  });

  it('another user cannot access comments of ticket they are not allowed', async () => {
    const response = await api
      .get('/api/tickets/search-results-are-inconsistent/comments')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(response.status).toBe(403);
    expect(response.body.data).toBeUndefined();

    expect(response.body.error.message).toBe(
      'You are not allowed to view this ticket'
    );
  });

  it('agent and admin can comments of tickets they are not allowed', async () => {
    const responseOne = await api
      .get('/api/tickets/search-results-are-inconsistent/comments')
      .set('Authorization', `Bearer ${agentToken}`);
    expect(responseOne.status).toBe(201);
    expect(responseOne.body.data).toHaveLength(1);

    expect(responseOne.body.data[0].body).toBe('first some comment');

    const responseTwo = await api
      .get('/api/tickets/search-results-are-inconsistent/comments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(responseTwo.status).toBe(201);
    expect(responseTwo.body.data).toHaveLength(1);

    expect(responseTwo.body.data[0].body).toBe('first some comment');
  });
});
