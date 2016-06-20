var collect = require('./lib/collect'),
    swagger = require('./lib/swagger'),
    http = require('http');


var write = (res) => {
  var collected = collect(res);
  swagger.write(collected);
};

exports.extract = write;

exports.probe = () => {
  var httpRequest = http.request;
  http.request = function(options, callback) {
    function interceptor() {
      var res = arguments[0].req.res;
      write(res);

      if (callback) callback();
    }
    return httpRequest.apply(http, [options, interceptor]);
  };
};
