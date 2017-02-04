const url = require('../../models/url.js');

class URL {    //Setup URL class.
    constructor(URL) {
        this.URL = URL;    //Original URL variable.
        this.shortURL = '/' + Math.random().toString(36).substr(2, Math.floor(Math.random() * (10 - 1) + 1));    //Creates shortened url from Math.random()
    }
}

module.exports = (express) => {    //Export the following function to be used by other modules.
    const router = express.Router();    //Set up router for this module.

    //POST URLS
    router.post('/urls', (req, res) => {
        if (req.body.URL) {    //If a URL was sent in the request body.
            const postURL = new URL(req.body.URL);    //Creates shortened URL with the infromation submitted and the URL class.

            url.add(postURL, (error) => {    //Otherwise respond with missing URL error.
                res.setHeader('Content-Type', 'application/json');    //Set the response content type to JSON.
                res.status(500).json(error);
            }, 
            (url) => {
                res.setHeader('Content-Type', 'application/json');    //Set the response content type to JSON.
                res.status(201).json({    //Respond back with created status and the url object.
                    status: {
                        code: 201
                    },
                    urls: [url]
                });
            });
        } else {
            res.setHeader('Content-Type', 'application/json');    //Set the response content type to JSON.
            res.status(422).json({
                status: {
                    code: 422,
                    error: 'You did not provide a url.'
                }
            });
        }
    });

    //GET URLS
    router.get('/urls', (req, res) => {
        url.findUrls((error) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json(error);
        }, 
        (urls) => {
            if (urls.length) {                                      //If there are URLs in the urls array.
                res.setHeader('Content-Type', 'application/json');  //Set the response content type to JSON.
                res.status(200).json({                              //Return the status and the urls array.
                    status: {
                        code: 200
                    },
                    urls: urls
                });
            } else {                                //Otherwise respond with missing URLS error message.
                res.setHeader('Content-Type', 'application/json');  //Set the response content type to JSON.
                res.status(404).json({
                    status: {
                        code: 404,
                        error: 'There are no urls.'
                    }
                });
            }
        });
    });

    //GET URLS BY ID
    router.get('/urls/:id', (req, res) => {
        const urlId = req.params.id;                         //Grab the ID from the URL.

        url.findUrl(urlId, (error) => {
            res.status(500).json(error);
        }, 
        (url) => {
            if (url != null) {
                res.status(200).json({              //Respond with the url.
                    status: {
                        code: 200
                    },
                    urls: [url]
                });                                  //Respond with the matching URL information.
            } else {
                res.status(404).json({                  //Respond with no url with the ID error message.
                    status: {
                        code: 404,
                        error: 'There is no url with the id ' + urlId + '.'
                    }
                });
            }
        });
    });

    router.post('/urls/:id', (req, res) => {
        req.body.id = req.params.id;

        url.update(
            req.body, 
            (error) => {
                console.log("This ran.");
                res.status(404).json({                  //Respond with no url with the ID error message.
                    status: {
                        code: 404,
                        error: 'There is no url with the id ' + req.body.id + '.'
                    }
                });
            },
            (url) => {
                console.log(url);
                res.status(200).json({              //Respond with the url.
                    status: {
                        code: 200
                    },
                    urls: [url]
                });       //Respond with the matching URL information.
            }
        );
    });

    return router;                                      //Return the router.
};
