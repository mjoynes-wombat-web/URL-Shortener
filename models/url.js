const db = require('./db');    //Require the db code.

//Create URL function.
function add (data, error, success) {    //The add URL function takes the data to be entered, the error function and the success function.
    db.url.find({    //Find any URL that matches.
        where: {
            URL: data.URL
        }
    }).then((existingURL) => {    //Then pass the results to this function.
        if (existingURL !== null) {    //If there is matching URLs then execute the success function and pass them to it.
            success(existingURL);
        } else {    //Otherwise continue checking the data.
            db.url.find({    //Find any URL that has a matching shortURL.
                where: {
                    shortURL: data.shortURL
                }
            }).then((duplicateURL) => {    //The pass any duplicate short URLs to this function.
                if (duplicateURL !== null) {    //If there are duplicate short URLs then re-create the shortURL and restart the function.
                    data.shortURL = Math.random().toString(36).substr(2, Math.floor(Math.random() * (10 - 1) + 1));
                    add(data, error, success);
                } else {    //If there are no duplicate short URLs then add the URL to the database and run success or if failed error.
                    db.url.create(data).then(success).catch(error);
                }
            });
        }
    }).catch(error);  //If the find fails then run the error.
}

exports.add = add;    //Export add to make it available.

//Update URL function
exports.update = (data, error, success) => {    //The update URL function takes data, an error function, and a success function.
    db.url.find({    //Find any urls that match the ID from the data.
        where: {
            id: data.id
        }
    })
    .then( (existingURL) => {    //Then update the existing URL with the new data and run success or if failed error.
        existingURL.updateAttributes(data).then(success).catch(error);
    })
    .catch(error); //If the find fails then run the error.
};

//Find All URL
exports.findAllUrls = (error, success) => {    //The find all URLs function takes, an error function, and a success function.
    db.url.findAll()    //Find All URLs.
    .then(success)    //If successful run success.
    .catch(error);    //If failed run error.
};

//Find 1 URL
exports.findUrl = (data, error, success) => {    //The find URL function takes data, an error function, and a success function.
    db.url.find({    //Find a URL based on the ID from data.
        where: {
            id: data.id
        }
    })
    .then(success)   //If successful run success.
    .catch(error);    //If failed run error.
};

//Delete URL
exports.destroy = (data, error, success) => {    //The delete URL function takes data, an error function, and a success function.
    db.url.destroy({    //Delete a URL based on the ID from data.
        where: {
            id: data.id
        }
    })
    .then(success)    //If successful run success.
    .catch(error);    //If failed run error.
};

//Find Full URL
exports.findFullUrl = (data, error, success) => {    //The find full URL function takes data, an error function, and a success function.
    db.url.find({    //Find a URL based on the short URL from data.
        where: {
            shortURL: data.shortURL
        }
    })
    .then(success)    //If successful run success.
    .catch(error);    //If failed run error.
};

