const url = require('../../models/url.js');    //Grab URLs model.

class URL {    //Setup URL class.
    constructor(URL) {
        this.URL = URL;    //Original URL variable.
        this.shortURL = Math.random().toString(36).substr(2, Math.floor(Math.random() * (10 - 1) + 1));    //Creates shortened url from Math.random()
    }
}

module.exports = (express) => {    //Export the following function to be used by other modules.
    const router = express.Router();    //Set up router for this module.

    //POST URL CREATION
    router.post('/urls', (req, res) => {
        if (req.body.URL) {    //If a URL was sent in the request body.
            const postURL = new URL(req.body.URL);    //Creates shortened URL with the information submitted and the URL class.

            url.add(    //Run url add passing it the url data, an error function and a success function.
                postURL, 
                (error) => {    //The error function takes an error message.
                    res.status(500).json(error);    //It responds with a server error and the error message.
                },
                (url) => {    //The success function takes the data from a url.
                    res.status(201).json({    //It responds with a created status and the url object.
                        status: {
                            code: 201
                        },
                        urls: [url]
                    }
                );
            });
        } else {    //Otherwise if there was no URL.
            res.status(422).json({    //Respond with an unprocessable entity error and missing url error message.
                status: {
                    code: 422,
                    error: 'You did not provide a url.'
                }
            });
        }
    });

    //GET URLS
    router.get('/urls', (req, res) => {
        url.findAllUrls(    //Run url findAllUrls passing it an error function and a success function.
            (error) => {    //The error function accepts an error message.
                res.status(500).json(error);     //It responds with a server error and the error message.
            },
            (urls) => {    //The success function takes the data from the urls.
                if (urls.length) {    //If there are URLs.
                    res.status(200).json({    //Return the ok status and the urls array.
                        status: {
                            code: 200
                        },
                        urls: urls
                    });
                } else {    //Otherwise respond with no URLS error message.
                    res.status(404).json({
                        status: {
                            code: 404,
                            error: 'There are no urls.'
                        }
                    });
                }
            }
        );
    });

    //GET URLS BY ID
    router.get('/urls/:id', (req, res) => {
        req.body.id = req.params.id;    //Grab the ID from the URL.

        url.findUrl(    //Run url findURL passing it the url data, an error function, and a success function.
            req.body,
            (error) => {    //The error function accepts an error message.
                res.status(500).json(error);     //It responds with a server error and the error message.
            },
            (url) => {    //The success function takes the data from a url.
                if (url !== null) {    //If the url is not null.
                    res.status(200).json({              //Respond with the ok status and url.
                        status: {
                            code: 200
                        },
                        urls: [url]
                    });
                } else {  //Otherwise respond with no URLS of that id error message.
                    res.status(404).json({
                        status: {
                            code: 404,
                            error: 'There is no url with the id ' + req.body.id + '.'
                        }
                    });
                }
            }
        );
    });

    //POST URL UPDATE BY ID
    router.post('/urls/:id', (req, res) => {
        req.body.id = req.params.id;    //Grab the ID from the URL.

        url.update(    //Run url update passing it the url data, an error function, and a success function.
            req.body, 
            (error) => {    //The error function accepts an error message.
                res.status(404).json({    //Respond with not found error and no url with the ID error message.
                    status: {
                        code: 404,
                        error: 'There is no url with the id ' + req.body.id + '.'
                    }
                });
            },
            (url) => {    //The success function takes the updated data from a url.
                res.status(200).json({    //Respond with the ok status and update URL.
                    status: {
                        code: 200
                    },
                    urls: [url]
                });
            }
        );
    });

    router.delete('/urls/:id', (req, res) => {
        req.body.id = req.params.id;    //Grab the ID form the URL.

        url.destroy(    //Run url destroy passing it the url data, an error function, and a success function.
            req.body,
            (error) =>{    //The error function accepts an error message.
                res.status(500).json(error);    //Respond with server error and error message.
            },
            (url) => {    //The success function takes the response from the deleted url.
                if (url){    //If the response from the deleted URL is true.
                    res.status(200).json({    //Respond with the OK status, the id of the delete url and deleted true.
                        status: {
                            code: 200
                        },
                        urls: [
                            {
                                id: req.body.id,
                                deleted: true
                            }
                        ]
                    });
                } else {    //If the response from the deleted URL wasn't true.
                    res.status(404).json({    //Respond with the 404 not found status and missing url error message.
                        status: {
                            code: 404,
                            error: 'There is no url with the id ' + req.body.id + '.'
                        }
                    });
                }
            }
        );
    });

    return router;                                      //Return the router.
};
