// Pulling Requirements.
const expect = require('chai').expect;
const request = require('supertest');
const nock = require('nock');
const log = require('debug-tool-express');

// Testing API Route Access.
describe('API Route Access', () => {
  // Setting server and time variables.
  let server;
  const time = new Date().toISOString();
  // Route Objects.
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

  // Before each tet run these.
  beforeEach(() => {
    // Setup server
    server = require('../server.js');

    // Loop through routes object and create nock servers.
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
  // After each test, close the server.
  afterEach(() => {
    server.close();
  });
  // Loop through the routes object.
  Object.keys(routes).forEach((key) => {
    switch (key) {
      // If the route is a get route.
      case 'get':
        describe('Testing GET Routes', () => {
          // Log out testing GET message.
          log.debug({
            logMsg: 'Testing GET Routes.',
            level: 'DEBUG',
          });
          // For each of the get routes.
          routes[key].forEach((route) => {
            // Log out testing this GET route message.
            log.debug({
              logMsg: `Testing GET Route ${route.url}.`,
              level: 'DEBUG',
            });
            // Test the route against the nock servers and make sure the code response item matches
            // the routes object.
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
      // If the route is a post route.
      case 'post':
        describe('Testing POST Routes', () => {
          // Log out testing POST message.
          log.debug({
            logMsg: 'Testing POST Routes.',
            level: 'DEBUG',
          });
          // For each of the post routes.
          routes[key].forEach((route) => {
            // Log out testing this POST route message.
            log.debug({
              logMsg: `Testing POST Route ${route.url}.`,
              level: 'DEBUG',
            });
            // Test the route against the nock servers and make sure the code response item matches
            // the routes object.
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
        // If the route is a delete route.
        describe('Testing DELETE Routes', () => {
          // Log out testing DELETE message.
          log.debug({
            logMsg: 'Testing DELETE Routes.',
            level: 'DEBUG',
          });
          // For each of the delete routes.
          routes[key].forEach((route) => {
            // Log out testing this DELETE route message.
            log.debug({
              logMsg: `Testing POST Route ${route.url}.`,
              level: 'DEBUG',
            });
            // Test the route against the nock servers and make sure the code response item matches
            // the routes object.
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
