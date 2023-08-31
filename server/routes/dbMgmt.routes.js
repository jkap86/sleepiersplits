module.exports = app => {
    const router = require("express").Router();
    const dbMgmt = require('../controllers/dbMgmt.controller');

    router.get('/addcolumns', dbMgmt.addColumns);


    app.use('/db', router);
}