const Packception = require('packception');
const packception = new Packception(process.cwd());
global.packception = packception;
global.nodeModules = packception.readModules();
global.allDependencies = global.nodeModules.getAllDependencies();
require('./app');
