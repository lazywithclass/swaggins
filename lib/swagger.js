var fs = require('fs'),
    touch = require('touch')


exports.write = (res) => {
  var file = 'swagger.json';
  touch.sync(file);
  var json = fs.readFileSync(file, 'utf8');
  json = json ? JSON.parse(json) : init();

  var converted = convert(res);
  json.paths[converted.path] = {};
  json.paths[converted.path][converted.method] = converted.call;

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};

var convert = exports.convert = (res) => {
  var converted = {};
  var method = normaliseMethod(res.req.method),
      status = res.statusCode,
      headers = res.headers;

  var path = converted[res.req.path] = {};
  path[method] = { responses: {} };
  path[method].responses[status] = {
    headers: filterHeaders(headers)
  };

  return {
    path: res.req.path,
    method: method,
    call: converted
  };
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
