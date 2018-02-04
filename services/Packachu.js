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
    if(target === 'ajv') {
    dependency.getPackage().readModules().getDependencies()
      .then(async (d) => {
        const devD = await d.get('co').getPackage();
        console.log(devD)
      })

    } return dependency;
  }

  static async getDependencyMeta (dependencyName, nestedDeps, onComplete) {
    const deps = await global.allDependencies;
    let dependency = Packachu.findOne(deps, dependencyName);
    if (!nestedDeps || !nestedDeps.length) {
      return onComplete(null, dependency);
    }
   
    let rootDeps = await dependency.getPackage().readModules().getAllDependencies();
    let tempDep;
    async.every(nestedDeps,async (dep, callback) => {
        tempDep = Packachu.findOne(rootDeps, dep);
        if(!tempDep) {
          return false;
        }
        rootDeps = await tempDep.getPackage().readModules().getAllDependencies();
        return tempDep;
    }, (error, result) => {
        if(error) {
          return onComplete(error);
        }

        onComplete(null, tempDep);
    });    
  }
}

module.exports = Packachu;
