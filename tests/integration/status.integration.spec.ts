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

describe('testing status history updates in all cases', () => {
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
  it('testing when a successfull status change creates status history or not', async () => {
    const ticketId = 'export-report-fails';
    const res = await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'OPEN' });
    const updatedRes = await api
      .get(`/api/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(updatedRes.body.data.status).toBe('OPEN');
    const stsHistory = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(stsHistory.body.data.data[0].fromStatus).toBe('IN_PROGRESS');
    expect(stsHistory.body.data.data[0].toStatus).toBe('OPEN');
    expect(stsHistory.statusCode).toBe(200);
  });
  it('Testing by giving input as same status', async () => {
    const ticketId = 'payment-failed-during-checkout';
    const res = await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.body).toHaveProperty('error');
    const stsHistory = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(stsHistory.body.data.pagination.total).toBe(0);
  });
  it('Testing  status type trying to change by an user', async () => {
    const ticketId = 'payment-failed-during-checkout';
    const res = await api
      .patch(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error');
  });
  it('Testing status history reading as a user', async () => {
    const ticketId = 'incorrect-invoice-total';
    const res = await api
      .get(`/api/tickets/${ticketId}/status-history`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res.statusCode).toBe(200);
  });
  it('Testing pagination for getting status-history', async () => {
    const ticketId = 'incorrect-invoice-total';
    const res = await api
      .get(`/api/tickets/${ticketId}/status-history?page=2&limit=1`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res.body.data.data.length).toBe(1);
    expect(res.body.data.pagination.page).toBe(2);
    expect(res.body.data.pagination.limit).toBe(1);
  });
});
