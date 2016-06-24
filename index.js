var swagger = require('./lib/swagger'),
    http = require('http');


exports.extract = swagger.write;

exports.probe = () => {
  var httpRequest = http.request;
  http.request = function(options, callback) {
    function interceptor() {
      var res = arguments[0].req.res;
      // TODO this is terrible, isn't the body somewhere
      // in the req or res?
      res.req.body = options.body
      swagger.write(res);

      if (callback) callback();
    }
    return httpRequest.apply(http, [options, interceptor]);
  };
};
