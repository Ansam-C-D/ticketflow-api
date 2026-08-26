import request from 'supertest';
import './test-db.js';
import { app } from '../../src/app.ts';

export const api = request(app);
