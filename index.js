var collect = require('./lib/collect'),
    swaggerAdaptor = require('./lib/swagger');


exports.extract = (res) => {
  var collected = collect(res);
  swaggerAdaptor.write(collected);
};
