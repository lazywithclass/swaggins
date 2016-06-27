var fs = require('fs'),
    touch = require('touch'),
    annotation = require('./swagger-type-annotation');


exports.write = (res) => {
  var file = 'swagger.json';
  touch.sync(file);
  var json = fs.readFileSync(file, 'utf8');
  json = json ? JSON.parse(json) : init();

  var converted = convert(res);
  json.paths[converted.path] = {};
  json.paths[converted.path][converted.method] = converted.call;
  json.definitions = json.definitions || {};

  if (converted.definition)
    json.definitions[converted.definitionKey] =
    converted.definition[converted.definitionKey];

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};

var convert = exports.convert = (res) => {
  var converted = {};
  var method = normaliseMethod(res.req.method),
      status = res.statusCode,
      headers = res.headers;

  converted = { responses: {} };
  converted.responses[status] = {
    // TODO somehow headers are screwing things up
    // headers: filterHeaders(headers)
  };

  var definition = {};
  if (res.req.body) {
    var definitionKey = res.req.path.replace(/\//g, '.') + '-' + method;
    converted.responses[status]['schema'] = {
      '$ref': '#/definitions/' + definitionKey
    }

    definition[definitionKey] = {
      properties: assignTypes(JSON.parse(res.req.body))
    }
  }

  return {
    path: res.req.path,
    method: method,
    call: converted,
    definition: definition,
    definitionKey: definitionKey
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

function assignTypes(obj) {
  // TODO still have to recognise if obj is an array
  // in swagger-type-annotation

  // TODO we need to remove that ".properties" here
  // that's becase ALL object except the first
  // have the { type: 'object', properties: {} }
  // structure

  return annotation.object(obj).properties;
}
