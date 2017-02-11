const expect = require('chai').expect;
const request = require('supertest');
const rewire = require('rewire');

describe('API Route Access', () => {
  let server;

  const routes = [
    '/go/:shortUrl',
    '/api/v1/urls',
    '/api/v1/urls/:id',
  ];

  beforeEach(() => {
    server = require('../server.js');
  });

  afterEach(() => {
    server.close();
  });

  routes.forEach((route) => {
    it (`GET Response from ${route}`, (done) => {
      request(server)
      .get(route)
      .expect(200)
      .end(done);
    });
  });
});
