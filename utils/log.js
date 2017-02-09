require('dotenv').config();

function debug(req, res, next) {
  if (process.env.DEBUG === 'true') {
    if (req.method === 'GET') {
      console.log(new Date(), req.method, req.url);
    }
    next();
  }
}

module.exports = debug;
