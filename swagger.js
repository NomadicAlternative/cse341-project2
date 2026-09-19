// Generates swagger.json from the route definitions.
// Run with `npm run swagger`. The host is read from the environment so the
// generated document can point at Render without editing code.
require('dotenv').config();

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Recipe Book API',
    description: 'CSE 341 Project 2 — CRUD API for recipes and categories',
    version: '1.0.0',
  },
  host: process.env.SWAGGER_HOST || 'localhost:8080',
  schemes: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
