let express = require('express');

let router = express.Router();
const packages = require('../handlers/packages');
/* GET users listing. */
router.get('/meta', packages.meta);
router.get('/packages', packages.getDependencies);
router.get('/packages/:package*', packages.single);
module.exports = router;
