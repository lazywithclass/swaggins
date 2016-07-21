var swagger = require('./lib/swagger'),
    http = require('http');


exports.extract = swagger.write;

exports.probe = () => {
  var httpRequest = http.request;
  http.request = function(options, callback) {
    function interceptor() {

      var res = arguments[0].req.res,
          req = arguments[0].req;

      if (req._headers['x-swaggins-ignore']) {
        if (callback) return callback.apply(null, arguments);
        return;
      }

      // TODO does this work only for GETs?
      var chunks = '';
      res.on('data', function(chunk) { chunks += chunk });
      res.on('end', function() {
        if (res.headers['content-type'].startsWith('application/json')) {
          res.body = chunks;
          swagger.writeResponse(res.req);
        }
      });

      // TODO this is terrible, isn't the body somewhere
      // in the req or res?
      res.req.body = options.body
      swagger.write(res);

      if (callback) callback.apply(null, arguments);
    }
    return httpRequest.apply(http, [options, interceptor]);
  };
};
