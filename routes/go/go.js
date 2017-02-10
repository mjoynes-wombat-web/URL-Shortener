const url = require('../../models/url.js'); // Require the URL model.
const log = require('../../utils/log'); // Retrieve the logger.

// Export the following function to be used by other modules.
module.exports = (express) => {
  const router = express.Router(); // Set up router for this module.

  // GET URL GO REDIRECT
  router.get('/:shortURL', (req, res) => {
    const request = req;
    request.body.shortURL = req.params.shortURL; // Grab the short URL from the url.
    // Log access
    log.debug({
      logMsg: `Attempting to access the website at short URL /${request.body.shortURL}.`,
      method: request.method,
      url: (request.baseUrl + request.url),
      ip: request.ip,
      level: 'INFO',
    });
    // Run url findFullUrl passing it the url data, an error function and a success function.
    url.findFullUrl(
      request.body,
      // The error function accepts an error message.
      (error) => {
        // Log out server error.
        log.debug({
          logMsg: error,
          method: request.method,
          url: (request.baseUrl + request.url),
          ip: request.ip,
          level: 'ERROR',
        });
        res.status(500).json(error); // Return the server error status and error message.
      },
      // The success function accepts the url info.
      (u) => {
        if (u !== null) { // If url is not null.
          // Log out accessing short url message.
          log.debug({
            logMsg: `Accessing website at short URL /${request.body.shortURL}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'INFO',
          });
          res.status(307).redirect(u.URL); // Redirect to the full URL.
        } else { // Otherwise if url is null.
          // Log out no url.
          log.debug({
            logMsg: `The short URL /${request.body.shortURL} is not in the database.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'ERROR',
          });
          res.status(404).json({ // Respond with a 404 not found and invalid short URL.
            status: {
              code: 404,
              error: `The url ${request.body.shortURL} is not a valid short URL.`,
            },
          });
        }
      });
  });

  return router; // Return the router.
};
