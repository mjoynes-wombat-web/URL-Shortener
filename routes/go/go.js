const url = require('../../models/url.js'); // Require the URL model.
const log = require('../../utils/log'); // Retrieve the logger.

// Export the following function to be used by other modules.
module.exports = (express) => {
  const router = express.Router(); // Set up router for this module.

  // GET URL GO REDIRECT
  router.get('/:shortURL', (req, res) => {
    req.body.shortURL = req.params.shortURL; // Grab the short URL from the url.

    // Run url findFullUrl passing it the url data, an error function and a success function.
    url.findFullUrl(
      req.body,
      // The error function accepts an error message.
      (error) => {
        // Log out server error.
        log.debug({
          logMsg: error,
          method: req.method,
          url: (req.baseUrl + req.url),
          ip: req.ip,
          level: 'ERROR',
        });
        res.status(500).json(error); // Return the server error status and error message.
      },
      // The success function accepts the url info.
      (url) => {
        if (url !== null) { // If url is not null.
          // Log out accessing short url message.
          log.debug({
            logMsg: `Accessing website at short URL /${req.body.shortURL}.`,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'INFO',
          });
          res.status(307).redirect(url.URL); // Redirect to the full URL.
        } else { // Otherwise if url is null.
          // Log out no url.
          log.debug({
            logMsg: `The short URL /${req.body.shortURL} is not in the database.`,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'ERROR',
          });
          res.status(404).json({ // Respond with a 404 not found and invalid short URL.
            status: {
              code: 404,
              error: `The url ${req.body.shortURL} is not a valid short URL.`,
            },
          });
        }
      });
  });

  return router; // Return the router.
};
