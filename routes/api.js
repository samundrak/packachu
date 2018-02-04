let express = require('express');

let router = express.Router();
const packages = require('../handlers/packages');

router.get('/meta', packages.meta);
router.get('/packages', packages.getDependencies);
router.get('/packages/:package*', packages.single);
module.exports = router;
