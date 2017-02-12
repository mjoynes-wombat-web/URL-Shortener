const expect = require('chai').expect;
const request = require('supertest');
const rewire = require('rewire');
const nock = require('nock');

describe('API Route Access', () => {
  let server;
  const time = new Date().toISOString();

  const routes = {
    get: [
      {
        url: '/go/abcd',
        code: 307,
        resData: {},
      },
      {
        url: '/api/v1/urls',
        code: 200,
        resData: {
          status: {
            code: 200,
          },
          urls: [
            {
              id: 1,
              URL: 'http://www.wombatweb.us',
              shortUrl: 'abcd',
              createdAt: time,
              updatedAt: time,
            },
          ],
        },
      },
      {
        url: '/api/v1/urls/1',
        code: 200,
        resData: {
          status: {
            code: 200,
          },
          urls: [
            {
              id: 1,
              URL: 'http://www.wombatweb.us',
              shortUrl: 'adbcd',
              createdAt: time,
              updatedAt: time,
            },
          ],
        },
      },
    ],
    post: [
      {
        url: '/api/v1/urls',
        code: 201,
        reqData: {
          URL: 'http://www.designbright.org',
        },
        resData: {
          status: {
            code: 201,
          },
          urls: [
            {
              id: 2,
              URL: 'http://www.designbright.org',
              shortUrl: Math.random()
                .toString(36)
                .substr(2, Math.floor((Math.random() * (10 - 1)) + 1)),
              createdAt: time,
              updatedAt: time,
            },
          ],
        },
      },
      {
        url: '/api/v1/urls/1',
        code: 200,
        reqData: {
          URL: 'http://www.designbright.org',
        },
        resData: {
          status: {
            code: 200,
          },
          urls: [
            {
              id: 1,
              URL: 'http://www.designbright.org',
              shortUrl: 'abcd',
              createdAt: time,
              updatedAt: time,
            },
          ],
        },
      },
    ],
    delete: [
      {
        url: '/api/v1/urls/1',
        code: 200,
        resData: {
          status: {
            code: 200,
          },
          urls: [
            {
              id: 1,
              deleted: true,
            },
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    server = require('../server.js');
    shortUrl = 'abcd';

    Object.keys(routes).forEach((key) => {
      routes[key].forEach((route) => {
        if (key === 'get') {
          nock('http://localhost:3000').get(route.url).reply(route.code, route.resData);
        } else if (key === 'post') {
          nock('http://localhost:3000').post(route.url).reply(route.code, route.resData);
        } else if (key === 'delete') {
          nock('http://localhost:3000').delete(route.url).reply(route.code, route.resData);
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
            it(`Response from ${route.url}`, (done) => {
              request('localhost:3000')
                .get(route.url)
                .expect(route.code)
                .end((err, res) => {
                  const response = JSON.parse(res.text);

                  if (route.code === 200) {
                    Object.keys(response.urls[0]).forEach((k) => {
                      expect(response.urls[0][k]).to.equal(route.resData.urls[0][k]);
                    });
                  }

                  done();
                });
            });
          });
        });
        break;
      case 'post':
        describe('Testing POST Routes', () => {
          routes[key].forEach((route) => {
            it(`Response from ${route.url}`, (done) => {
              request('localhost:3000')
                .post(route.url)
                .send(route.reqData)
                .expect(route.code)
                .end((err, res) => {
                  const response = JSON.parse(res.text);

                  Object.keys(response.urls[0]).forEach((k) => {
                    expect(response.urls[0][k]).to.equal(route.resData.urls[0][k]);
                  });

                  done();
                });
            });
          });
        });
        break;
      case 'delete':
        describe('Testing DELETE Routes', () => {
          routes[key].forEach((route) => {
            it(`Response from ${route.url}`, (done) => {
              request('localhost:3000')
                .delete(route.url)
                .send(route.reqData)
                .expect(route.code)
                .end((err, res) => {
                  const response = JSON.parse(res.text);

                  Object.keys(response.urls[0]).forEach((k) => {
                    expect(response.urls[0][k]).to.equal(route.resData.urls[0][k]);
                  });

                  done();
                });
            });
          });
        });
        break;
      default:
        break;
    }
  });
});
