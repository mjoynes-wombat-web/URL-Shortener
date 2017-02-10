const url = require('../../models/url.js');    // Grab URLs model.
const log = require('../../utils/log'); // Retrieve the logger.

class URL {    // Setup URL class.
  constructor(addr) {
    this.URL = addr;    // Original URL variable.
    // Creates shortened url from Math.random()
    this.shortURL = Math.random().toString(36).substr(2, Math.floor((Math.random() * (10 - 1)) + 1));
  }
}

module.exports = (express) => {    // Export the following function to be used by other modules.
  const router = express.Router();    // Set up router for this module.

  // POST URL CREATION
  router.post('/urls', (req, res) => {
    if (req.body.URL) {    // If a URL was sent in the request body.
      // Creates shortened URL with the information submitted and the URL class.
      const postURL = new URL(req.body.URL);

      url.add(    // Run url add passing it the url data, an error function and a success function.
        postURL,
        (error) => {    // The error function takes an error message.
          // Log out server error.
          log.debug({
            logMsg: error,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'ERROR',
          });

          res.status(500).json(error);    // It responds with a server error and the error message.
        },
        (u) => {    // The success function takes the data from a url.
          // Log out created short URL message.
          log.debug({
            logMsg: `Created a short URL for ${req.body.URL}.`,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'INFO',
          });
          res.setHeader('Content-Type', 'application/json');
          res.status(201).json({    // It responds with a created status and the url object.
            status: {
              code: 201,
            },
            urls: [u],
          });
        });
    } else {    // Otherwise if there was no URL.
      // Respond with an unprocessable entity error and missing url error message.
      // Log out missing URL message.
      log.debug({
        logMsg: 'No URL provided.',
        method: req.method,
        url: (req.baseUrl + req.url),
        ip: req.ip,
        level: 'ERROR',
      });
      res.status(422).json({
        status: {
          code: 422,
          error: 'You did not provide a url.',
        },
      });
    }
  });

  // GET URLS
  router.get('/urls', (req, res) => {
    url.findAllUrls(    // Run url findAllUrls passing it an error function and a success function.
      (error) => {    // The error function accepts an error message.
        res.status(500).json(error);     // It responds with a server error and the error message.
        // Log out server error.
        log.debug({
          logMsg: error,
          method: req.method,
          url: (req.baseUrl + req.url),
          ip: req.ip,
          level: 'ERROR',
        });
      },
      (urls) => {    // The success function takes the data from the urls.
        if (urls.length) {    // If there are URLs.
          // Log out the URLs found message.
          log.debug({
            logMsg: 'All URLs gathered.',
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'INFO',
          });

          res.status(200).json({    // Return the ok status and the urls array.
            status: {
              code: 200,
            },
            urls,
          });
        } else {    // Otherwise respond with no URLS error message.
          // Log out no URLs message.
          log.debug({
            logMsg: 'There are no URLs in the database',
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'ERROR',
          });
          res.status(404).json({
            status: {
              code: 404,
              error: 'There are no urls.',
            },
          });
        }
      });
  });

  // GET URLS BY ID
  router.get('/urls/:id', (req, res) => {
    const request = req;
    request.body.id = req.params.id;    // Grab the ID from the URL.

    // Run url findURL passing it the url data, an error function, and a success function.
    url.findUrl(
      request.body,
        (error) => {    // The error function accepts an error message.
          res.status(500).json(error);     // It responds with a server error and the error message.
        },
        (u) => {    // The success function takes the data from a url.
          // Log out request.
          log.debug({
            logMsg: `Requested URL with the id of ${request.body.id}.`,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'INFO',
          });

          if (u !== null) {    // If the url is not null.
            res.status(200).json({              // Respond with the ok status and url.
              status: {
                code: 200,
              },
              urls: [u],
            });
          } else {  // Otherwise respond with no URLS of that id error message.
            // Log out error.
            log.debug({
              logMsg: `There is no url with the id ${request.body.id}.`,
              method: req.method,
              url: (req.baseUrl + req.url),
              ip: req.ip,
              level: 'ERROR',
            });

            res.status(404).json({
              status: {
                code: 404,
                error: `There is no url with the id ${req.body.id}.`,
              },
            });
          }
        });
  });

  // POST URL UPDATE BY ID
  router.post('/urls/:id', (req, res) => {
    const request = req;
    request.body.id = request.params.id;    // Grab the ID from the URL.
    // Run url update passing it the url data, an error function, and a success function.
    url.update(
      request.body,
      () => {    // The error function accepts an error message.
        // Respond with not found error and no url with the ID error message.
        res.status(404).json({
          status: {
            code: 404,
            error: `There is no url with the id ${request.body.id}.`,
          },
        });
      },
      (u) => {    // The success function takes the updated data from a url.
        res.status(200).json({    // Respond with the ok status and update URL.
          status: {
            code: 200,
          },
          urls: [u],
        });
      });
  });

  router.delete('/urls/:id', (req, res) => {
    const request = req;
    request.body.id = request.params.id;    // Grab the ID form the URL.
    // Run url destroy passing it the url data, an error function, and a success function.
    url.destroy(
      req.body,
        (error) => {    // The error function accepts an error message.
          res.status(500).json(error);    // Respond with server error and error message.
        },
        (u) => {    // The success function takes the response from the deleted url.
          if (u) {    // If the response from the deleted URL is true.
            // Respond with the OK status, the id of the delete url and deleted true.
            res.status(200).json({
              status: {
                code: 200,
              },
              urls: [
                {
                  id: req.body.id,
                  deleted: true,
                },
              ],
            });
          } else {    // If the response from the deleted URL wasn't true.
            // Respond with the 404 not found status and missing url error message.
            res.status(404).json({
              status: {
                code: 404,
                error: `There is no url with the id ${req.body.id}.`,
              },
            });
          }
        });
  });

  return router;    // Return the router.
};
