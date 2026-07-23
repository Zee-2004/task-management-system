import request from 'supertest';
import app from '../app';

let token: string;

beforeAll(async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: '123456' });
  token = response.body.token;
});

describe('Task Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDateStr = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test description',
          priority: 'Medium',
          status: 'Pending',
          due_date: dueDateStr,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Task');
    });

    it('should fail when title is missing', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          priority: 'Medium',
          status: 'Pending',
          due_date: tomorrow.toISOString().split('T')[0],
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when due date is in the past', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Past Task',
          priority: 'Low',
          status: 'Pending',
          due_date: '2020-01-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/stats/dashboard', () => {
    it('should return dashboard stats', async () => {
      const response = await request(app)
        .get('/api/tasks/stats/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBeDefined();
      expect(response.body.data.pending).toBeDefined();
      expect(response.body.data.completed).toBeDefined();
      expect(response.body.data.overdue).toBeDefined();
    });
  });
});