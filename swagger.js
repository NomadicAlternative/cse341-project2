// Generates swagger.json from the route definitions.
// Run with `npm run swagger`. The host is read from the environment so the
// generated document can point at Render without editing code.
require('dotenv').config();

const swaggerAutogen = require('swagger-autogen')();

// The host comes from the environment, and the scheme follows the host, so
// that "Try it out" works both locally and on the deployed service.
const host = process.env.SWAGGER_HOST || 'localhost:8080';
const hostIsLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');

const doc = {
  info: {
    title: 'Recipe Book API',
    description: 'CSE 341 Project 2 — CRUD API for recipes and categories',
    version: '1.0.0',
  },
  host,
  // Swagger UI's "Try it out" uses the first scheme, and a page served over
  // https blocks a plain http request (mixed content). So the scheme follows
  // the host: http for localhost, https for the deployed service.
  schemes: hostIsLocal ? ['http'] : ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
