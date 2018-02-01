var express = require('express');
var router = express.Router();
const packages = require('../handlers/packages');
/* GET users listing. */
router.get('/packages', packages.getDependencies);
router.get('/packages/:package', packages.single);
module.exports = router;
