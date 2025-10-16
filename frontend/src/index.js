const express = require('express');
const axios = require('axios');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Middleware
app.use(express.json());

// Middleware to track request duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(duration);
  });
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'frontend' });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', service: 'frontend' });
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Home page
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TechCommerce!',
    service: 'frontend',
    version: '1.0.0'
  });
});

// Get products from Product API
app.get('/products', async (req, res) => {
  try {
    const productApiUrl = process.env.PRODUCT_API_URL || 'http://product-api:5000';
    const response = await axios.get(`${productApiUrl}/api/products`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get orders from Order API
app.get('/orders', async (req, res) => {
  try {
    const orderApiUrl = process.env.ORDER_API_URL || 'http://order-api:5000';
    const response = await axios.get(`${orderApiUrl}/api/orders`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend service running on port ${PORT}`);
  });
}

module.exports = app;
