const db = require('./db');    // Require the db code.

// Create URL function.
// The add URL function takes the data to be entered, the error function and the success function.
function add(data, error, success) {
  db.url.find({    // Find any URL that matches.
    where: {
      URL: data.URL,
    },
  }).then((existingURL) => {    // Then pass the results to this function.
    // If there is matching URLs then execute the success function and pass them to it.
    if (existingURL !== null) {
      success(existingURL);
    // Otherwise continue checking the data.
    } else {
      db.url.find({    // Find any URL that has a matching shortURL.
        where: {
          shortURL: data.shortURL,
        },
      }).then((duplicateURL) => {    // The pass any duplicate short URLs to this function.
        // If there are duplicate short URLs then re-create the shortURL and restart the function.
        if (duplicateURL !== null) {
          const correctedData = data;
          correctedData.shortURL = Math.random()
                                                 .toString(36)
                                                 .substr(2, Math.floor((Math.random() * (10 - 1)) + 1));
          add(correctedData, error, success);
        // If there are no duplicate short URLs then add the URL to the database and run success or if failed error.
        } else {
          db.url.create(data).then(success).catch(error);
        }
      });
    }
  }).catch(error);  // If the find fails then run the error.
}

exports.add = add;    // Export add to make it available.

// Update URL function
// The update URL function takes data, an error function, and a success function.
exports.update = (data, error, success) => {
  db.url.find({    // Find any urls that match the ID from the data.
    where: {
      id: data.id,
    },
  })
  // Then update the existing URL with the new data and run success or if failed error.
  .then((existingURL) => {
    existingURL.updateAttributes(data).then(success).catch(error);
  })
  .catch(error); // If the find fails then run the error.
};

// Find All URL
// The find all URLs function takes, an error function, and a success function.
exports.findAllUrls = (error, success) => {
  db.url.findAll()    // Find All URLs.
  .then(success)    // If successful run success.
  .catch(error);    // If failed run error.
};

// Find 1 URL
// The find URL function takes data, an error function, and a success function.
exports.findUrl = (data, error, success) => {
  db.url.find({    // Find a URL based on the ID from data.
    where: {
      id: data.id,
    },
  })
  .then(success)   // If successful run success.
  .catch(error);    // If failed run error.
};

// Delete URL
// The delete URL function takes data, an error function, and a success function.
exports.destroy = (data, error, success) => {
  db.url.destroy({    // Delete a URL based on the ID from data.
    where: {
      id: data.id,
    },
  })
  .then(success)    // If successful run success.
  .catch(error);    // If failed run error.
};

// Find Full URL
// The find full URL function takes data, an error function, and a success function.
exports.findFullUrl = (data, error, success) => {
  db.url.find({    // Find a URL based on the short URL from data.
    where: {
      shortURL: data.shortURL,
    },
  })
  .then(success)    // If successful run success.
  .catch(error);    // If failed run error.
};

