const expect = require('chai').expect;
const rewire = require('rewire');
let urlModel = rewire('../models/url.js');



describe('URL Model Queries', () => {
  let urls = [
    {
      id: 11,
      URL: 'https://docs.google.com/',
      shortURL: 'ui05f',
      createdAt: '2017-02-04T18:14:52.000Z',
      updatedAt: '2017-02-05T00:42:02.000Z',
    },
    {
      id: 12,
      URL: 'http://www.amazon.com',
      shortURL: 'idtrl21k1',
      createdAt: '2017-02-04T18:14:58.000Z',
      updatedAt: '2017-02-04T18:14:58.000Z',
    },
    {
      id: 13,
      URL: 'http://inbox.google.com',
      shortURL: 'ua9qq',
      createdAt: '2017-02-04T18:15:07.000Z',
      updatedAt: '2017-02-04T18:15:07.000Z',
    },
    {
      id: 14,
      URL: 'http://www.gmail.com',
      shortURL: '6',
      createdAt: '2017-02-04T18:15:14.000Z',
      updatedAt: '2017-02-04T18:15:14.000Z',
    },
    {
      id: 15,
      URL: 'http://www.facebook.com',
      shortURL: 'plvgbuv',
      createdAt: '2017-02-04T18:23:14.000Z',
      updatedAt: '2017-02-04T18:23:14.000Z',
    },
  ];

  class URL {    // Setup URL class.
    constructor(addr) {
      this.id = 100 + 1;
      this.URL = addr;    // Original URL variable.
      // Creates shortened url from Math.random()
      this.shortURL = Math.random()
        .toString(36)
        .substr(2, Math.floor((Math.random() * (10 - 1)) + 1));
      this.createdAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }
  }

  beforeEach(() => {
    urlModel.__set__('db.url',
      {
        find: (data) => {
          let resData = [];
          urls.forEach((u) => {
            let match;
            Object.keys(data.where).forEach((w) => {
              if (data.where[w] === u[w] && (match === true || match === undefined)) {
                match = true;
                return;
              }
              match = false;
            });

            if (match) {
              resData.push(u);
            }
          });
          return new Promise((resolve, reject) => {
            if (data === undefined) {
              reject('There was no data passed.');
            }

            if (resData.length === 0) {
              resData = null;
            }

            resolve(resData);
          });
        },
        create: (data) => {
          return new Promise((resolve, reject) => {
            if (data === undefined) {
              reject('There was no data passed.');
            }

            const newUrl = new URL(data.URL);
            urls.push(newUrl);

            resolve(newUrl);
          });
        },
        findAll: () => ({ urls }),
        destroy: (data) => {
          const resData = [];
          urls.forEach((u, index) => {
            let match;
            Object.keys(data.where).forEach((w) => {
              if (data.where[w] === u[w] && (match === true || match === undefined)) {
                match = true;
                return;
              }
              match = false;
            });

            if (match) {
              resData.push(u);
              urls.splice(index, 1);
            }
          });

          return resData.id;
        },
      });
  });

  describe('Testing Adding URL', () => {
    it('The URL was added successfully.', (done) => {
      const _this = this;
      const results = urlModel.add(
        { URL: 'http://www.asdfawegaaaassdg.com' },
        (err) => {
          return err;
        },
        (u) => {
          console.log(u);
           _this.expect(1).to.equal(2);
          return u;
        });

      console.log(results);
      done();
    });
  });
});






