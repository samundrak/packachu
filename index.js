const Packception = require('packception');
const packception = new Packception(process.cwd());
global.packception = packception;
global.nodeModules = packception.readModules();
global.allDependencies = global.nodeModules.getAllDependencies();
// require('./app');
const fn = function findOne (deps, target) {
  let dependency = null;
  deps.every((element) => {
    if (element.has(target)) {
      dependency = element.get(target);
      return false;
    }
    return true;
  });
  return dependency;
};

(async () => {
  const express = fn(await global.allDependencies, 'express');
  const accepts = fn(await express.getPackage()
    .readModules()
    .getAllDependencies(), 'accepts');
  const eslint = fn(await accepts.getPackage()
    .readModules()
    .getAllDependencies(), 'eslint');
  const ajv = fn(await eslint.getPackage()
    .readModules()
    .getAllDependencies(), 'ajv');
  // var resolve = require('resolve');
  // var res = resolve.sync('beefy',{ baseDir: eslint.getPackage()._hostLocation});
  // console.log(res);
  console.log(ajv);
})();
