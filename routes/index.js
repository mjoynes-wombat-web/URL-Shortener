// Export the following function to be used by other modules.
module.exports = (express) => {
  const router = express.Router();    // Set up router for this module.

  const apiURLRoute = require('./api/url');
  router.use('/api/v1/', apiURLRoute(express));   // Use the api/url.js router for requests on /api/v1/
  router.use('/go/', require('./go/go')(express));    // Use the go/go.js router for requests on /go/

  return router;    // Return the router.
};
