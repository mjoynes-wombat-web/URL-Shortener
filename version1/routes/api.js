module.exports = function(express){                     //Export the following function to be used by other modules.
    var router = express.Router();                      //Set up router for this module.

    //POST URLS
    router.post('/urls', function(req, res){
        res.json({hello: 'world'});                     //Placeholder response.
    });

    //GET URLS
    router.get('/urls', function(req, res){
        res.json({urls: 'array of urls'});              //Placeholder response.
    });

    //GET URLS BY ID
    router.get('/urls/:id', function(req, res){
        res.json({urls: req.params.id});                //Placeholder response.
    });

    return router;                                      //Return the router.
};
