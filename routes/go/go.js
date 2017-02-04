const url = require('../../models/url.js');

module.exports = (express) => {
    const router = express.Router();

    router.get('/:shortURL', (req, res) => {
        req.body.shortURL = req.params.shortURL;

        url.findFullUrl(
            req.body,
            (error) => {
                res.status(500).json(error);
            },
            (urls) => {
                if (urls !== null) {
                    res.status(200).redirect(urls.URL);
                } else {
                    res.status(404);
                }
            }
        );
    });

    return router;
};