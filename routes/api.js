class URL {                                                         //Setup URL class.
    constructor(urlId, origURL) {
        this.urlId = urlId;         //URL ID variable.
        this.origURL = origURL;     //Original URL variable.
        this.shortURL = '/' + Math.random().toString(36).substr(2, Math.floor(Math.random() * (10 - 1) + 1));          //Creates shortened url from Math.random()
    }
}



let urls = [];                                                      //Setup urls array to hold the URLs created form the URL class.

urls.push(new URL(1, "https://www.amazon.com/dp/B00X4WHP5E/ref=ods_gw_ha_d_blackandwhite?pf_rd_r=QREX1YK8J8EMC8C05PYZ&pf_rd_p=da93a4f0-0b0d-45e0-bc19-b68113bc6936"));   //Adding in static URLs for version 1.
urls.push(new URL(2, "https://play.google.com/music/m/T4ztvelxav2rehzomrwhpdpkxcu?t=Tones_Of_Home_-_Blind_Melon"));
urls.push(new URL(3, "https://inbox.google.com"));
urls.push(new URL(4, "https://www.facebook.com"));

module.exports = (express) => {                     //Export the following function to be used by other modules.
    const router = express.Router();                  //Set up router for this module.

    //POST URLS
    router.post('/urls', (req, res) => {
        if (req.body.url) {                         //If a URL was sent in the request body.
            postURL = new URL(5, req.body.url);      //Creates shortened URL with the infromation submitted and the URL class.

            res.setHeader('Content-Type', 'application/json');  //Set the response content type to JSON.
            res.status(201).json({                  //Respond back with created status and the url object.
                status: {
                    code: 201
                },
                urls: postURL
            });
        } else {                                                //Otherwise respond with missing URL error.
            res.setHeader('Content-Type', 'application/json');  //Set the response content type to JSON.
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

    //GET URLS BY ID
    router.get('/urls/:id', (req, res) => {
        const urlId = req.params.id;                         //Grab the ID from the URL.
        for (var u in urls) {                                //Loop through the arrays.
            if (urls[u].urlId == urlId) {            //If the ID from the URL matches the urlId .
                res.status(200).json({              //Respond with the url.
                    status: {
                        code: 200
                    },
                    urls: urls[u]
                });                                  //Respond with the matching URL information.
            }
        }

        if (res.status != 200) {                    //If the status is not set as 200.
            res.status(404).json({                  //Respond with no url with the ID error message.
                status: {
                    code: 404,
                    error: 'There is no url with the id ' + urlId + '.'
                }
            });
        }
    });

    return router;                                      //Return the router.
};
