const url = require('../../models/url.js');    //Require the URL model.

module.exports = (express) => {    //Export the following function to be used by other modules.
    const router = express.Router();    //Set up router for this module.

    //GET URL GO REDIRECT
    router.get('/:shortURL', (req, res) => {
        req.body.shortURL = req.params.shortURL; //Grab the short URL from the url.

        url.findFullUrl(    //Run url findFullUrl passing it the url data, an error function and a success function.
            req.body,
            (error) => {    //The error function accepts an error message.
                res.status(500).json(error);    //Return the server error status and error message.
            },
            (url) => {    //The success function accepts the url info.
                if (url !== null) {    //If url is not null.
                    res.status(307).redirect(url.URL);    //Redirect to the full URL.
                } else {    //Otherwise if url is null.
                    res.status(404).json({    //Respond with a 404 not found and invalid short URL.
                        status: {
                            code: 404,
                            error: 'The url ' + req.body.shortURL + ' is not a valid short URL.'
                        }
                    });
                }
            }
        );
    });

    return router;    //Return the router.
};