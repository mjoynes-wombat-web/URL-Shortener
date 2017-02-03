var urlShortener = require('../utils/urlShortener.js');


class URL {
    constructor(urlID, origURL){
        this.urlID = urlID;
        this.origURL = origURL;
        this.shortURL = 'http://localhost:3000/' + urlShortener.shorten(urlID);
    }
}

var urls = [];

urls.push(new URL(1241, "https://www.amazon.com/dp/B00X4WHP5E/ref=ods_gw_ha_d_blackandwhite?pf_rd_r=QREX1YK8J8EMC8C05PYZ&pf_rd_p=da93a4f0-0b0d-45e0-bc19-b68113bc6936"));
urls.push(new URL(8723461, "https://play.google.com/music/m/T4ztvelxav2rehzomrwhpdpkxcu?t=Tones_Of_Home_-_Blind_Melon"));
urls.push(new URL(1241, "https://inbox.google.com"));
urls.push(new URL(12623, "https://www.facebook.com"));

module.exports = (express) => {                     //Export the following function to be used by other modules.
    var router = express.Router();                      //Set up router for this module.

    //POST URLS
    router.post('/urls', (req, res) => {
        urlID = 91247125;

        postURL = new URL(91247125, req.body.url);
        
        res.json(postURL);
    });

    //GET URLS
    router.get('/urls', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(urls);              //Placeholder response.
    });

    //GET URLS BY ID
    router.get('/urls/:id', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        for (var u in urls){
            if (urls[u].urlID == req.params.id){
                res.json(urls[u]);
                break;
            }
        }
    });

    return router;                                      //Return the router.
};
