import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app.js';
import {
  disconnectTestDatabase,
  prisma,
  resetTestDatabase
} from '../helpers/test-db.js';
import type { Ticket } from '@prisma/client';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('History API', () => {
  let adminToken: string;
  let _agentToken: string;
  let _user1Token: string;
  let _user2Token: string;
  let _agentId: string;

  let tickets: Ticket[];
  beforeAll(async () => {
    await resetTestDatabase();
    tickets = await prisma.ticket.findMany();

    adminToken = await login('admin@example.com', 'Admin123!');
    _agentToken = await login('agent@example.com', 'Agent123!');
    _user1Token = await login('user1@example.com', 'User123!');
    _user2Token = await login('user2@example.com', 'User234!');

    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${adminToken}`);

    _agentId = usersResponse.body.data[0].id as string;
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('Make a status history change', async () => {
    const response = await api
      .patch(`/api/tickets/${tickets[0]?.id}/status`)
      .set('Authorization', `Bearer ${_agentToken}`)
      .send({
        status: 'IN_PROGRESS'
      });

    expect(response.statusCode).toBe(200);

    const histories = await api
      .get(`/api/tickets/${tickets[0]?.id}/status-history`)
      .set('Authorization', `Bearer ${_agentToken}`)
      .send();

    expect(histories.body[0].ticketId).toBe(tickets[0]?.id);
  });

  it('Histories are correctly added', async () => {
    const response = await api
      .patch(`/api/tickets/${tickets[1]?.id}/status`)
      .set('Authorization', `Bearer ${_agentToken}`)
      .send({
        status: 'RESOLVED'
      });

    expect(response.body).toBe(200);

    const histories = await api
      .get(`/api/tickets/${tickets[1]?.id}/status-history`)
      .set('Authorization', `Bearer ${_agentToken}`)
      .send();

    expect(histories.body[0].ticketId).toBe(tickets[1]?.id);
  });

  it('Should prevent unauthorised user from changing status', async () => {
    const response = await api
      .patch(`/api/tickets/${tickets[2]?.id}/status`)
      .set('Authorization', `Bearer ${_user1Token}`)
      .send({
        status: 'IN_PROGRESS'
      });

    expect(response.statusCode).toBe(403);
  });
});
