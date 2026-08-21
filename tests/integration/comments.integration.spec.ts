import { beforeAll, afterAll, it, describe } from 'vitest';
import { api } from '../helpers/test-app.js';

import {
  disconnectTestDatabase,
  resetTestDatabase
} from '../helpers/test-db.js';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('Testing comment apis', () => {
  let adminToken: string;
  let user1Token: string;
  beforeAll(async () => {
    await resetTestDatabase();
    adminToken = await login('admin@example.com', 'Admin123!');
    user1Token = await login('user1@example.com', 'User123!');
  });
  afterAll(async () => {
    await disconnectTestDatabase();
  });
  it('create comment endpoint for an existing ticket', async () => {
    const listResponse = await api
      .get('/api/tickets?page=1&limit=5')
      .set('Authorization', `Bearer ${user1Token}`);
    const ticketId = listResponse.body.data[0].id;
    const inputData = {
      body: 'Nice service'
    };
    const commentResponse = await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send(inputData);
    expect(commentResponse.statusCode).toBe(201);
    expect(commentResponse.body.data.ticketId).toBe(ticketId);
  });
  it('Create comment endpoint for an invalid ticket', async () => {
    const commentResponse = await api
      .post('/api/tickets/absj/comment')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ body: 'Amazing' });
    expect(commentResponse.statusCode).toBe(404);
  });
  it('Listing all comments as an authorized user', async () => {
    const listResponse = await api
      .get('/api/tickets?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);
    const ticketId = listResponse.body.data[0].id;
    const response = await api
      .get(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(response.statusCode).toBe(200);
  });
  it('Unauthorized comment creation', async () => {
    const listResponse = await api
      .get('/api/tickets?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);
    const ticketId = listResponse.body.data[0].id;
    const response = await api
      .post(`/api/tickets/${ticketId}/comments`)
      .send({ body: 'Success' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
  it('Creating comment with invalid bearer token', async () => {
    const listResponse = await api
      .get('/api/tickets?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);
    const ticketId = listResponse.body.data[0].id;
    const response = await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', 'Bearer jkkj')
      .send({ body: 'Success' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
