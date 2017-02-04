module.exports = (express) => {
    const router = express.Router();

    router.use('/api/v1/', require('./api/url')(express));
    router.use('/go/', require('./go/go')(express));

    return router;
};