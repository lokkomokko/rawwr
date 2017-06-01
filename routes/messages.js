var express = require('express');
var router = express.Router();
import * as db from '../db/utils/DataBaseUtils';

db.setUpConnection()

router.get('/', (req, res, next) => {
    db.listMess().then(data => res.send(data));
});

router.post('/', (req, res, next) => {
    db.createMess(req.body).then(data => res.send(data));
});

module.exports = router;