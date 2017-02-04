const db = require('./db');

exports.add = (data, error, success) => {
    db.url.create(data)
    .then(success)
    .catch(error);
};

exports.update = (data, error, success) => {
    db.url.find({
        where: {
            id: data.id
        }
    })
    .then( (existingData) => {
        existingData.updateAttributes(data).then(success);
    })
    .catch(error);
};

exports.findUrls = (error, success) => {
    db.url.findAll()
    .then(success)
    .catch(error);
};

exports.findUrl = (data, error, success) => {
    db.url.find({
        where: {
            id: data.id
        },

        include: [{
            all: true,
            nested: true
        }]
    })
    .then(success)
    .catch(error);
};

exports.destroy = (data, error, success) => {
    db.url.destroy({
        where: {
            id: data.id
        }
    })
    .then(success)
    .catch(error);
};

