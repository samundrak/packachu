const async = require('async');

class Packachu {
  static getMeta () {
    return global.packception.getPackage();
  }

  static async normalizedDependencies (type) {
    const mainDep = await global.nodeModules;
    let deps = null;
    switch (type) {
      case 'dependencies':
        deps = await mainDep.getDependencies();
        break;
      case 'devDependencies':
        deps = await mainDep.getDevDependencies();
        break;
      case 'peerDependencies':
        deps = await mainDep.getPeerDependencies();
        break;
      default:
        deps = await global.allDependencies;
        break;
    }
    const normalized = {};
    (Array.isArray(deps) ? deps : [deps]).forEach((element) => {
      for (const [key, value] of element) {
        if (!normalized[value._type]) {
          normalized[value._type] = [];
        }
        normalized[value._type].push(value);
      }
    });
    return normalized;
  }

  static findOne (deps, target) {
    let dependency = null;
    deps.every((element) => {
      if (element.has(target)) {
        dependency = element.get(target);
        return false;
      }
      return true;
    });
    return dependency;
  }

  static async getDependencyMeta (dependencyName, nestedDeps, onComplete) {
    const deps = await global.allDependencies;
    let dependency = Packachu.findOne(deps, dependencyName);
    if (!nestedDeps || !nestedDeps.length) {
      return Promise.resolve(dependency);
    }
    let parentDeps = await dependency.getPackage()
      .readModules()
      .getAllDependencies();
    let singleDep = null;
    return async.every(
      nestedDeps,
      (dep, callback) => {
        const tempDep = Packachu.findOne(parentDeps, dep);
        if (!tempDep) {
          return callback(new Error(`Module ${dep} not found.`));
        }

        return tempDep.getPackage()
          .readModules()
          .getAllDependencies()
          .then((tempDepDeps) => {
            parentDeps = tempDepDeps;
            callback(null, parentDeps);
          })
          .catch((err) => {
            return callback(err);
          });
      },
      (err, result) => {
        console.log(err, result, parentDeps);
        onComplete(err, result ? singleDep : null);
      },
    );
  }
}

module.exports = Packachu;
