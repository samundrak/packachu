const debug = require('debug')('packages');
const Packachu = require('../services/Packachu');

module.exports = {
  async meta (req, res) {
    res.json(await Packachu.getMeta());
  },
  async getDependencies (req, res) {
    try {
      const type = req.query.type || 'all';
      res.json(await Packachu.normalizedDependencies(type));
    } catch (err) {
      debug(err);
      res.boom.badImplementation();
    }
  },
  async single (req, res) {
    const nested = req.params[0].split('/')
      .filter(item => !!item);
    try {
      await Packachu.getDependencyMeta(
        req.params.package,
        nested,
        (err, result) => {
          if (!result || err) {
            debug(err);
            return res.boom.notFound();
          }
          return res.json(result);
        },
      );
    } catch (err) {
      debug(err);
      console.log(err);
      res.boom.badImplementation();
    }
  },
};
