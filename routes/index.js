var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const indexController = require('../tom_controllers/index');

/* GET home page. */
router.get('/', indexController.getIndex);
// router.get('/sonagitv-all/:num*', indexController.getAllValue);
router.get('/search/:name*', indexController.getSearch);
router.get('/sonagitv-new', indexController.getNewValue);
router.get('/*', indexController.getOther);

module.exports = router;
