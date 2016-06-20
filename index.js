var swagger = require('./lib/swagger'),
    http = require('http');


exports.extract = swagger.write;

exports.probe = () => {
  var httpRequest = http.request;
  http.request = function(options, callback) {
    function interceptor() {
      var res = arguments[0].req.res;
      swagger.write(res);

      if (callback) callback();
    }
    return httpRequest.apply(http, [options, interceptor]);
  };
};
