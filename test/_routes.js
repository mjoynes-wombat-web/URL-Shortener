const expect = require('chai').expect;
const request = require('supertest');
const rewire = require('rewire');
const nock = require('nock');

describe('API Route Access', () => {
  let server;

  const routes = {
    get: [
      '/go/abcd',
      '/api/v1/urls',
      '/api/v1/urls/1',
    ],
    post: [
      '/api/v1/urls',
      '/api/v1/urls/1',
    ],
    delete: [
      '/api/v1/1',
    ],
  };

  beforeEach(() => {
    server = require('../server.js');

    Object.keys(routes).forEach((key) => {
      routes[key].forEach((route) => {
        if (key === 'get') {
          nock('http://localhost:3000').get(route).reply(200);
        } else if (key === 'post') {
          nock('http://localhost:3000').post(route).reply(201);
        } else if (key === 'delete') {
          nock('http://localhost:3000').delete(route).reply(200);
        }
      });
    });
  });

  afterEach(() => {
    server.close();
  });

  Object.keys(routes).forEach((key) => {
    switch (key) {
      case 'get':
        describe('Testing GET Routes', () => {
          routes[key].forEach((route) => {
            it(`Response from ${route}`, (done) => {
              request('localhost:3000')
                .get(route)
                .expect(200)
                .end(done);
            });
          });
        });
        break;
      case 'post':
        describe('Testing POST Routes', () => {
          routes[key].forEach((route) => {
            it(`Response from ${route}`, (done) => {
              request('localhost:3000')
                .post(route)
                .expect(201)
                .end(done);
            });
          });
        });
        break;
      case 'delete':
        describe('Testing DELETE Routes', () => {
          routes[key].forEach((route) => {
            it(`Response from ${route}`, (done) => {
              request('localhost:3000')
                .delete(route)
                .expect(200)
                .end(done);
            });
          });
        });
        break;
      default:
        break;
    }
  });
});
