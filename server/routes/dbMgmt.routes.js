module.exports = app => {
    const router = require("express").Router();
    const dbMgmt = require('../controllers/dbMgmt.controller');

    router.get('/addcolumns', dbMgmt.addColumns);

    router.get('/addidcolumn', dbMgmt.createIdColumn);

    router.get('/populateplayerplays', dbMgmt.populateplayerplays)

    app.use('/db', router);
}