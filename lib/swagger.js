var fs = require('fs'),
    touch = require('touch')


exports.write = (res) => {
  var file = 'swagger.json';
  touch.sync(file);
  var json = fs.readFileSync(file, 'utf8');
  json = json ? JSON.parse(json) : init();

  json.paths = convert(res).paths;

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};

var convert = exports.convert = (res) => {
  var converted = { paths: {} };
  var method = normaliseMethod(res.req.method),
      status = res.statusCode,
      headers = res.headers;

  var path = converted.paths[res.req.path] = {};
  path[method] = { responses: {} };
  path[method].responses[status] = {
    headers: filterHeaders(headers)
  };

  return converted;
};

function filterHeaders(headers) {
  var headersWhitelist = ['content-type'],
      documentationHeaders = {};
  for (var header in headers) {
    var isDocumentationHeader = /x-.*/.test(header) ||
          headersWhitelist.indexOf(header) > -1;
    if(headers.hasOwnProperty(header) && isDocumentationHeader) {
      documentationHeaders[header] = headers[header];
    }
  }
  return documentationHeaders;
}

function init() {
  return  {
    swagger: '2',
    info: {
      version: '?.?.?',
      title: ''
    },
    paths: {}
  }
}

function normaliseMethod(method) {
  return method.toLowerCase();
}
