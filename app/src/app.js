const express = require('express');
const client = require('prom-client');

const app = express();
app.use(express.json());

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const deploymentCounter = new client.Counter({
  name: 'deployments_total',
  help: 'Total number of deployments',
  labelNames: ['environment', 'status'],
  registers: [register]
});

const deploymentDuration = new client.Histogram({
  name: 'deployment_duration_seconds',
  help: 'Deployment duration in seconds',
  labelNames: ['environment'],
  buckets: [30, 60, 120, 300, 600],
  registers: [register]
});

// In memory store
let deployments = [];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/deployments', (req, res) => {
  res.json({ deployments, total: deployments.length });
});

app.post('/deployments', (req, res) => {
  const { environment, version, status, duration } = req.body;

  if (!environment || !version || !status) {
    return res.status(400).json({ error: 'environment, version and status are required' });
  }

  const deployment = {
    id: deployments.length + 1,
    environment,
    version,
    status,
    duration: duration || 0,
    timestamp: new Date().toISOString()
  };

  deployments.push(deployment);

  deploymentCounter.inc({ environment, status });
  if (duration) {
    deploymentDuration.observe({ environment }, duration);
  }

  res.status(201).json(deployment);
});

app.get('/deployments/stats', (req, res) => {
  const total = deployments.length;
  const successful = deployments.filter(d => d.status === 'success').length;
  const failed = deployments.filter(d => d.status === 'failed').length;
  const successRate = total > 0 ? ((successful / total) * 100).toFixed(2) : 0;

  res.json({ total, successful, failed, successRate: `${successRate}%` });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = app;