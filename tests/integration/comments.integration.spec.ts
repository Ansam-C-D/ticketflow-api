import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api } from '../helpers/test-app.js';
import {
  disconnectTestDatabase,
  prisma,
  resetTestDatabase
} from '../helpers/test-db.js';
import type { Comment } from '@prisma/client';

async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login').send({ email, password });
  return response.body.data.token as string;
}

describe('Comment API', async () => {
  let adminToken: string;
  let _agentToken: string;
  let user1Token: string;
  let user2Token: string;
  let _agentId: string;

  const tickets = await prisma.ticket.findMany();

  beforeAll(async () => {
    await resetTestDatabase();

    adminToken = await login('admin@example.com', 'Admin123!');
    _agentToken = await login('agent@example.com', 'Agent123!');
    user1Token = await login('user1@example.com', 'User123!');
    user2Token = await login('user2@example.com', 'User234!');

    const usersResponse = await api
      .get('/api/users?role=AGENT')
      .set('Authorization', `Bearer ${adminToken}`);

    _agentId = usersResponse.body.data[0].id as string;
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('Creates a comment', async () => {
    const response = await api
      .post(`/api/tickets/${tickets[0]?.id}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'I have looked at your account and found no issues'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.body).toBe(
      'I have looked at your account and found no issues'
    );
  });

  it('retrieves all comments of a ticket', async () => {
    // const tickets = await prisma.ticket.findMany()

    const commentsOfTicket = await api
      .get(`/api/tickets/${tickets[0]?.id}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send();

    expect(commentsOfTicket.body).toEqual(expect.any(Array));

    (commentsOfTicket.body as Comment[]).forEach((comment) => {
      expect(comment.ticketId).toEqual(tickets[0]?.id);
    });
  });

  it('blocks retrieves of all comments of a ticket by unauthorized user', async () => {
    // const tickets = await prisma.ticket.findMany()

    const commentsOfTicket = await api
      .get(`/api/tickets/${tickets[0]?.id}/comments`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send();

    expect(commentsOfTicket.body).toEqual(expect.any(Array));

    (commentsOfTicket.body as Comment[]).forEach((comment) => {
      expect(comment.ticketId).toEqual(tickets[0]?.id);
    });
  });

  it("prevents creating a comment in another user's ticket", async () => {
    const response = await api
      .post(`/api/tickets/${tickets[1]?.id}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        body: 'I have looked at your account and found no issues'
      });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  it('It returns comments with pagenation', async () => {
    const commentsOfTicket = await api
      .get(`/api/tickets/comments/list?limit=2&page=1`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send();

    expect(commentsOfTicket.body.length).toBe(2);

    const secondCommentsOfTicket = await api
      .get(`/api/tickets/comments/list?limit=2&page=2`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send();

    expect(commentsOfTicket.body).not.toEqual(secondCommentsOfTicket.body);

    const morePageSize = await api
      .get(`/api/tickets/comments/list?limit=3&page=1`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send();

    expect(morePageSize.body.length).toBe(3);
  });
});
