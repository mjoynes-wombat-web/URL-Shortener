const expect = require('chai').expect;
const rewire = require('rewire');

const urlModel = rewire('../models/url.js');

describe('URL Model Queries', () => {
  const urls = [
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
          return new Promise((reject, resolve) => {
            if (data === undefined) {
              reject('There was no data passed.');
            }

            if (resData.length === 0) {
              resData = null;
            }
            resolve(resData);
          });
        },
        create: data => new Promise((reject, resolve) => {
          if (data === undefined) {
            reject('There was no data passed.');
          }

          const newUrl = new URL(data.URL);
          urls.push(newUrl);
          resolve(newUrl);
        }),
        findAll: () => new Promise((reject, resolve) => {
          if (urls.length === 0) { reject('No Urls.'); }
          resolve(urls);
        }),
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

          return new Promise((reject, resolve) => {
            if (resData.length === 0) {
              reject('No url found.');
            }

            resolve(resData.id);
          });
        },
      });
  });

  describe('Testing Adding URL', () => {
    it('The URL was added successfully.', (done) => {
      urlModel.add(
        { URL: 'http://www.asdfawegaaaassdg.com' },
        err => err,
        u => u);
      done();
    });
  });

  describe('Testing Updating URL', () => {
    it('The URL was update successfully.', (done) => {
      urlModel.update(
        {
          id: 11,
          URL: 'http://www.asdfawegaaaassdg.com',
        },
        err => err,
        u => u);
      done();
    });
  });
  describe('Testing Find All URL', () => {
    it('The URL was found successfully.', (done) => {
      urlModel.findAllUrls(
        err => err,
        u => u);
      done();
    });
  });
  describe('Testing Find URL 11', () => {
    it('The URL was found successfully.', (done) => {
      urlModel.findUrl(
        {
          id: 11,
        },
        err => err,
        u => u);
      done();
    });
  });
  describe('Testing Destroy URL 11', () => {
    it('The URL was found successfully.', (done) => {
      urlModel.destroy(
        {
          id: 11,
        },
        err => err,
        u => u);
      done();
    });
  });
  describe('Testing Find Full URL for URL 11.', () => {
    it('The Full URL was found successfully.', (done) => {
      urlModel.findFullUrl(
        {
          id: 11,
        },
        err => err,
        u => u);
      done();
    });
  });
});
