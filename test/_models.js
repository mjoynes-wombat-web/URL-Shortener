// Pull in requirements.
const expect = require('chai').expect;
const rewire = require('rewire');
const log = require('../utils/log');

// Pull in the urlModel and use rewire on it to modify it later.
const urlModel = rewire('../models/url.js');

// Testing URL Model Queries.
describe('URL Model Queries', () => {
  // Array of URL objects for testing data.
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

  // URL Class
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

  // Before each test.
  beforeEach(() => {
    // Rewire the urlModel sequelize functions to prevent database access in testing.
    urlModel.__set__('db.url',
      {
        // Redefine the find function
        find: (data) => {
          // Loop through the where variables and log out the searching message.
          Object.keys(data.where).forEach((key) => {
            log.debug({
              logMsg: `Searching for the URL with ${key} ${data.where[key]} in the mock data.`,
              level: 'DEBUG',
            });
          });
          // Setup array to hold the matching URLs.
          let resData = [];

          // Loop through the URLs
          urls.forEach((u) => {
            // Setup up variable for the matching URL.
            let match;

            // Loop through the where variables and see if they all match the current url that
            // we're in.
            Object.keys(data.where).forEach((w) => {
              if (data.where[w] === u[w] && (match === true || match === undefined)) {
                match = true;
                return;
              }
              match = false;
            });

            // If there was a match then add it to the matching URL variable.
            if (match) {
              resData.push(u);

              // Loop through the where values again and unit test them against the current match.
              Object.keys(data.where).forEach((wh) => {
                expect(data.where[wh]).to.equal(resData[resData.length - 1][wh]);
              });
            }
          });
          // Return a promise.
          return new Promise((reject, resolve) => {
            // If the data was undefined then reject.
            if (data === undefined) {
              reject('There was no data passed.');
            }

            // If the response data was 0 then set it to null.
            if (resData.length === 0) {
              resData = null;
            }

            // Resolve the promise and return the resData.
            resolve(resData);
          });
        },
        // Redefine the create function.
        create: (data) => {
          // Log out the created shortURL message.
          log.debug({
            logMsg: `Creating the short URL for ${data.URL}.`,
            level: 'DEBUG',
          });
          // Create a new URL instance with the data.
          const newUrl = new URL(data.URL);

          // Add the new URL to the urls.
          urls.push(newUrl);

          // Expect that there is a new URL in the mock data.
          expect(data.URL).to.equal(urls[urls.length - 1].URL);

          // Return a promise.
          return new Promise((reject, resolve) => {
            // If there was no data then reject.
            if (data === undefined) {
              reject('There was no data passed.');
            }

            // Otherwise resolve with a new URL.
            resolve(newUrl);
          });
        },
        // Redefine find all URLs.
        findAll: () => {
          // Log out the grabbing all URLs message.
          log.debug({
            logMsg: 'Grabbing All URLs from the mock data.',
            level: 'DEBUG',
          });

          const resUrls = urls;

          // Expect the lengths of the urls to match the resUrls..
          expect(resUrls.length).to.equal(urls.length);

          // Return a promise
          return new Promise((reject, resolve) => {
            // If there are nor urls reject.
            if (resUrls.length === 0) { reject('No Urls.'); }
            // Resolve with the resUrls.
            resolve(resUrls);
          });
        },
        // Redefine destroy url.
        destroy: (data) => {
          // Loop through the where data and log output a deleting message.
          Object.keys(data.where).forEach((key) => {
            log.debug({
              logMsg: `Delete the URL from the database with the ${key} of ${data.where[key]} in the mock data.`,
              level: 'DEBUG',
            });
          });

          // Setup a response data array.
          const resData = [];

          // For each url
          urls.forEach((u, index) => {
            // Setup a variable to hold the match.
            let match;
            // Check to see if all wheres match.
            Object.keys(data.where).forEach((w) => {
              if (data.where[w] === u[w] && (match === true || match === undefined)) {
                match = true;
                return;
              }
              match = false;
            });

            // If all matched add the variable to the response data.
            if (match) {
              resData.push(u);

              // Grab the number of urls to make sure one got deleted.
              const numUrls = urls.length;

              // Delete the urls from teh urls array.
              urls.splice(index, 1);

              // Check to make sure a URL got deleted.
              expect(urls.length).to.equal(numUrls - 1);

              // Expect that the deleted url matches the values in where.
              Object.keys(data.where).forEach((wh) => {
                expect(data.where[wh]).to.equal(resData[resData.length - 1][wh]);
              });
            }
          });
          // Return a promise.
          return new Promise((reject, resolve) => {
            // If there is no response data reject.
            if (resData.length === 0) {
              reject('No url found.');
            }
            // Resolve with the response data.
            resolve(resData.id);
          });
        },
      });
  });

  // Test adding URLs.
  describe('Testing Adding URL', () => {
    // Log message about testing adding urls.
    log.debug({
      logMsg: 'Testing the add URL model functionality.',
      level: 'DEBUG',
    });
    // Make sure the add function runs.
    it('The URL was added successfully.', (done) => {
      urlModel.add(
        { URL: 'http://www.asdfawegaaaassdg.com' },
        err => err,
        u => u);
      done();
    });
  });

  // Test updating URLs.
  describe('Testing Updating URL', () => {
    // Log message about testing updating urls.
    log.debug({
      logMsg: 'Testing the update URL model functionality.',
      level: 'DEBUG',
    });
    // Make sure the adding urls function runs.
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
  // Testing find all URLs.
  describe('Testing Find All URL', () => {
    // Log message about finding all urls.
    log.debug({
      logMsg: 'Testing the find All URL model functionality.',
      level: 'DEBUG',
    });
    // Make sure the findAllUrls function runs.
    it('The URL was found successfully.', (done) => {
      urlModel.findAllUrls(
        err => err,
        u => u);
      done();
    });
  });
  // Testing finding URL by id.
  describe('Testing Find URL 11', () => {
    // Log message about finding url by ID.
    log.debug({
      logMsg: 'Testing the find URL by ID model functionality.',
      level: 'DEBUG',
    });
    // Make sure the findUrl function runs.
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
  // Testing the destroy URL by ID.
  describe('Testing Destroy URL 11', () => {
    // Log out message about testing destroy URL by ID.
    log.debug({
      logMsg: 'Testing the delete URL by ID model functionality.',
      level: 'DEBUG',
    });
    // Make sure the destroy function runs.
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
  // Test the find full url with short url function.
  describe('Testing Find Full URL for short URL ui05f.', () => {
    // Log message about testing find full url.
    log.debug({
      logMsg: 'Testing the find full URL by shortURL functionality.',
      level: 'DEBUG',
    });
    // Make sure the find full url works.
    it('The Full URL was found successfully.', (done) => {
      urlModel.findFullUrl(
        {
          shortURL: 'ui05f',
        },
        err => err,
        u => u);
      done();
    });
  });
});
