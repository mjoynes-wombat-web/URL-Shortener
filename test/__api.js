const expect = require('chai').expect;
const request = require('supertest');
const server = require('../server.js');


describe('API Route Access', () => {

  afterEach( () => {
    server.close();
  });

  it ('Response to /api/v1/urls', (done) => {
    request(server)
    .get('/api/v1/urls')
    .expect(200, done);
  });
});