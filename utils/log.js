require('dotenv').config();



function debug(req, res, next) {
  console.log(req.body);
  console.log(res.locals.test);
  // console.log('//////Response')
  // console.log(res);
  // console.log('////Request');
  // console.log(req);
  if (process.env.DEBUG === 'true') {
    if (req.method === 'GET') {
      if (req.url.match(new RegExp('/go/.*'))) {
        console.log(new Date(), req.method, req.url);
        console.log(res.body);
      }
      if (req.url.match(new RegExp('/api/v1/.*'))) {
        console.log(new Date(), req.method, req.url);
        console.log(req.params.id);
      }
    }
  }
}

module.exports = debug;
