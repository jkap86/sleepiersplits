module.exports = app => {
    const router = require("express").Router();
    const receivingSummary = require('../controllers/receivingSummary.controller');

    router.get('/recsummary', receivingSummary.player);


    app.use('/player', router);
}