const db = require('./db');    // Require the db code.
const log = require('../utils/log'); // Retrieve the logger.

// module.exports.db = db;

// Create URL function.
// The add URL function takes the data to be entered, the error function and the success function.
function add(data, error, success) {
  // Log find duplicate URL attempt.
  log.debug({
    logMsg: `Checking to see if ${data.URL} is already in the database.`,
    level: 'DEBUG',
  });
  db.url.find({    // Find any URL that matches.
    where: {
      URL: data.URL,
    },
  }).then((existingURL) => {    // Then pass the results to this function.
    // If there is matching URLs then execute the success function and pass them to it.
    if (existingURL !== null) {
      // Log duplicate URL.
      log.debug({
        logMsg: `The URL, ${data.URL}, already exists in the database. Returning it's information.`,
        level: 'DEBUG',
      });
      success(existingURL);
      // Otherwise continue checking the data.
    } else {
      // Log find duplicate short URL attempt.
      log.debug({
        logMsg: `Checking to see if the short URL, ${data.shortURL}, already exists in the database.`,
        level: 'DEBUG',
      });
      db.url.find({    // Find any URL that has a matching shortURL.
        where: {
          shortURL: data.shortURL,
        },
      }).then((duplicateURL) => {    // The pass any duplicate short URLs to this function.
        // If there are duplicate short URLs then re-create the shortURL and restart the function.
        if (duplicateURL !== null) {
          // Log duplicate short URL.
          log.debug({
            logMsg: `The short URL ${data.shortURL}, already exists in the database. Recreating the short URL.`,
            level: 'DEBUG',
          });
          const correctedData = data;
          correctedData.shortURL = Math.random()
            .toString(36)
            .substr(2, Math.floor((Math.random() * (10 - 1)) + 1));
          add(correctedData, error, success);
          // If there are no duplicate short URLs then add the URL to the database and run success
          // or if failed error.
        } else {
          // Log write URL attempt.
          log.debug({
            logMsg: `Attempting to add URL, ${data.URL}, with the short URL of ${data.shortURL}, to the database.`,
            level: 'DEBUG',
          });
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
      // Log update URL attempt.
      log.debug({
        logMsg: `Attempting to change the URL for ${data.id} to ${data.URL} in the database.`,
        level: 'DEBUG',
      });
      existingURL.updateAttributes(data).then(success).catch(error);
    })
  .catch(error); // If the find fails then run the error.
};

// Find All URL
// The find all URLs function takes, an error function, and a success function.
exports.findAllUrls = (error, success) => {
  // Log find URLs attempt.
  log.debug({
    logMsg: 'Attempting to gather the URLs from the database.',
    level: 'DEBUG',
  });
  db.url.findAll()    // Find All URLs.
  .then(success)    // If successful run success.
  .catch(error);    // If failed run error.
};

// Find 1 URL
// The find URL function takes data, an error function, and a success function.
exports.findUrl = (data, error, success) => {
  // Log find URL by ID attempt.
  log.debug({
    logMsg: `Attempting to find the URL for ID ${data.id} in the database.`,
    level: 'DEBUG',
  });
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
  // Log delete ULR by id attempt.
  log.debug({
    logMsg: `Attempting to delete the URL for ID ${data.id} from the database.`,
    level: 'DEBUG',
  });
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
  // Log find URL by short URL attempt.
  log.debug({
    logMsg: `Attempting to find the URL for short URL, ${data.shortURL} in the database.`,
    level: 'DEBUG',
  });
  db.url.find({    // Find a URL based on the short URL from data.
    where: {
      shortURL: data.shortURL,
    },
  })
  .then(success)    // If successful run success.
  .catch(error);    // If failed run error.
};

