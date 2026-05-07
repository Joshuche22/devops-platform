const request = require('supertest');
const app = require('../src/app');

describe('DevOps Metrics API', () => {

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /deployments', () => {
    it('should return empty deployments array initially', async () => {
      const res = await request(app).get('/deployments');
      expect(res.statusCode).toBe(200);
      expect(res.body.deployments).toBeDefined();
      expect(res.body.total).toBeDefined();
    });
  });

  describe('POST /deployments', () => {
    it('should create a new deployment', async () => {
      const res = await request(app)
        .post('/deployments')
        .send({
          environment: 'staging',
          version: '1.0.1',
          status: 'success',
          duration: 90
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.environment).toBe('staging');
      expect(res.body.version).toBe('1.0.1');
      expect(res.body.status).toBe('success');
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/deployments')
        .send({ environment: 'production' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /deployments/stats', () => {
    it('should return deployment statistics', async () => {
      const res = await request(app).get('/deployments/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.total).toBeDefined();
      expect(res.body.successful).toBeDefined();
      expect(res.body.failed).toBeDefined();
      expect(res.body.successRate).toBeDefined();
    });
  });

  describe('GET /metrics', () => {
    it('should return prometheus metrics', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('deployments_total');
    });
  });

});