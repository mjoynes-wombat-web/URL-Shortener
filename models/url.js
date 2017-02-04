const db = require('./db');

function add (data, error, success) {
    const duplicateURL = true;
    db.url.find({
        where: {
            URL: data.URL
        }
    }).then((existingData) => {
        if (existingData !== null) {
            success(existingData);
        } else {
            db.url.find({
                where: {
                    shortURL: data.shortURL
                }
            }).then((duplicateURL) => {
                if (duplicateURL !== null) {
                    console.log(data);
                    data.shortURL = Math.random().toString(36).substr(2, Math.floor(Math.random() * (10 - 1) + 1));
                    console.log(data);
                    add(data, error, success);
                } else {
                    db.url.create(data).then(success).catch(error);
                }
            })
        }
    });
}

exports.add = add;


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

exports.findFullUrl = (data, error, success) => {
    db.url.find({
        where: {
            shortURL: data.shortURL
        }
    })
    .then(success)
    .catch(error);
};

