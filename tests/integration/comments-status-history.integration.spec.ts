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

describe('comments and status history API', () => {
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

  it('creates a comment on a ticket', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Comment test ticket',
        description:
          'This ticket is created specifically to test comment creation.',
        priority: 'MEDIUM'
      });

    const ticketId = ticketResponse.body.data.id as string;

    const response = await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'I am adding a comment to this ticket.'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.ticketId).toBe(ticketId);
    expect(response.body.data.authorId).toBeDefined();
    expect(response.body.data.body).toBe(
      'I am adding a comment to this ticket.'
    );
  });

  it('lists comments on a ticket', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Comment listing test ticket',
        description:
          'This ticket is created specifically to test comment listing.',
        priority: 'MEDIUM'
      });

    const ticketId = ticketResponse.body.data.id as string;

    await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'First comment.'
      });

    await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'Second comment.'
      });

    const response = await api
      .get(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].ticketId).toBe(ticketId);
    expect(response.body.data[0].body).toBe('First comment.');
    expect(response.body.data[1].body).toBe('Second comment.');
  });

  it('prevents a user from commenting on another users ticket', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Unauthorized comment test ticket',
        description:
          'This ticket is created to test unauthorized comment creation.',
        priority: 'HIGH'
      });

    const ticketId = ticketResponse.body.data.id as string;

    const response = await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        body: 'User two should not be able to add this comment.'
      });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('allows an agent to view comments on tickets', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Agent comment viewing test',
        description:
          'This ticket is created to test agent comment viewing permissions.',
        priority: 'MEDIUM'
      });

    const ticketId = ticketResponse.body.data.id as string;

    await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'A comment that the agent should be able to view.'
      });

    const response = await api
      .get(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('prevents an agent from commenting on a ticket not assigned to them', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Unassigned agent comment test',
        description:
          'This ticket is created to test agent comment authorization.',
        priority: 'MEDIUM'
      });

    const ticketId = ticketResponse.body.data.id as string;

    const response = await api
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        body: 'The agent should not be able to add this comment.'
      });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('creates a status history record when ticket status changes', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Status history creation test',
        description:
          'This ticket is created to test automatic status history creation.',
        priority: 'MEDIUM'
      });

    const ticketId = ticketResponse.body.data.id as string;

    const statusResponse = await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_PROGRESS'
      });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.data.status).toBe('IN_PROGRESS');

    const historyResponse = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body.data).toHaveLength(1);

    expect(historyResponse.body.data[0].ticketId).toBe(ticketId);
    expect(historyResponse.body.data[0].fromStatus).toBe('OPEN');
    expect(historyResponse.body.data[0].toStatus).toBe('IN_PROGRESS');
  });

  it('retrieves status history for a ticket', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Status history retrieval test',
        description:
          'This ticket is created to test retrieving multiple history records.',
        priority: 'HIGH'
      });

    const ticketId = ticketResponse.body.data.id as string;

    await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_PROGRESS'
      });

    await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'RESOLVED'
      });

    const response = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);

    expect(response.body.data[0].fromStatus).toBe('OPEN');
    expect(response.body.data[0].toStatus).toBe('IN_PROGRESS');

    expect(response.body.data[1].fromStatus).toBe('IN_PROGRESS');
    expect(response.body.data[1].toStatus).toBe('RESOLVED');
  });

  it('allows an agent to view status history on tickets', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Agent status history viewing test',
        description:
          'This ticket is created to test agent status history permissions.',
        priority: 'MEDIUM'
      });

    const ticketId = ticketResponse.body.data.id as string;

    await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_PROGRESS'
      });

    const response = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('prevents a user from viewing status history of another users ticket', async () => {
    const ticketResponse = await api
      .post('/api/tickets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Unauthorized history viewing test',
        description:
          'This ticket is created to test status history authorization.',
        priority: 'LOW'
      });

    const ticketId = ticketResponse.body.data.id as string;

    await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'IN_PROGRESS'
      });

    const response = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });
});
