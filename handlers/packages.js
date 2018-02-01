const debug = require('debug')('packages');
module.exports = {
  async getDependencies(req, res) {
    try {
      const type = req.query.type || 'all';
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
      (Array.isArray(deps) ? deps : [deps]).forEach(element => {
        for (const [key, value] of element) {
          if (!normalized[value._type]) {
            normalized[value._type] = [];
          }
          normalized[value._type].push(value);
        }
      });
      res.json(normalized);
    } catch (err) {
      debug(err);
      res.boom.badImplementation();
    }
  },
  async single(req, res) {
    try {
      const deps = await global.allDependencies;
      console.log(deps);
      let package = null;
      deps.every(element => {
        if (element.has(req.params.package)) {
          package = element.get(req.params.package);
          return false;
        }
        return true;
      });
      if (!package) {
        return res.boom.notFound();
      }
      res.json(package);
    } catch (err) {
      debug(err);
      res.boom.badImplementation();
    }
  },
};
