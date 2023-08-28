module.exports = app => {
    const router = require("express").Router();
    const receivingTop50 = require('../controllers/receivingTop50.controller');

    router.get('/top50', receivingTop50.top50);


    app.use('/receiving', router);
}