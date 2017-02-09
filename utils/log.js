require('dotenv').config();



function debug(req, res, next) {
  console.log(req.body);
  console.log(res);
  if (process.env.DEBUG === 'true') {
    if (req.method === 'GET') {
      if (req.url.match(new RegExp('/go/.*'))) {
        console.log(new Date(), req.method, req.url);
        console.log(res.body);
      }
      else if (req.url.match(new RegExp('/api/v1/.*'))) {
        console.log(new Date(), req.method, req.url);
        console.log(req.params.id);
      }
    }
  }
}

module.exports = debug;
