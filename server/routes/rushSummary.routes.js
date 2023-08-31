module.exports = app => {
    const router = require("express").Router();
    const rushSummary = require('../controllers/rushSummary.controller');

    router.get('/rushsummary', rushSummary.player);


    app.use('/player', router);
}