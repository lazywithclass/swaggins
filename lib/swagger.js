var fs = require('fs'),
    touch = require('touch'),
    annotation = require('./swagger-type-annotation'),
    _ = require('lodash');


exports.write = (res) => {
  var file = 'swagger.json';
  touch.sync(file);
  var json = fs.readFileSync(file, 'utf8');
  json = json ? JSON.parse(json) : init();

  var converted = convert(res);
  json.paths[converted.path] = json.paths[converted.path] || {};
  json.paths[converted.path][converted.method] =
    _.merge(json.paths[converted.path][converted.method], converted.call);
  json.definitions = json.definitions || {};

  if (converted.definition)
    json.definitions[converted.definitionKey] =
    converted.definition[converted.definitionKey];

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};

exports.writeResponse = (req) => {
  var file = 'swagger.json';
  touch.sync(file);
  var json = fs.readFileSync(file, 'utf8');
  json = json ? JSON.parse(json) : init();

  var converted = convert(req.res);
  json.paths[converted.path] = json.paths[converted.path] || {};
  json.paths[converted.path][converted.method] =
    _.merge(json.paths[converted.path][converted.method], converted.call);
  json.definitions = json.definitions || {};

  if (converted.definition)
    json.definitions[converted.definitionKey] =
    converted.definition[converted.definitionKey];

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
}

var convert = exports.convert = (res) => {
  var converted = {};
  var method = normaliseMethod(res.req.method),
      status = res.statusCode,
      headers = res.headers;


  converted = { responses: {}, parameters: [] };
  converted.responses[status] = {
    headers: filterHeaders(headers)
  };
  var documentationHeaders = extractDocumentationHeaders(res.req._headers);
  var statusDescription
  if (documentationHeaders['x-swaggins-endpoint-description']) {
    converted.description = documentationHeaders['x-swaggins-endpoint-description'];
  }
  if (documentationHeaders['x-swaggins-tag']) {
    converted.tags = [documentationHeaders['x-swaggins-tag']];
  }
  if (documentationHeaders['x-swaggins-status-description']) {
    converted.responses[status].description =
      documentationHeaders['x-swaggins-status-description'];
  }
  var path = res.req.path;
  if (documentationHeaders['x-swaggins-path']) {
    path = documentationHeaders['x-swaggins-path'];
  }

  var definition = {};
  if (res.req.body) {
    var definitionKey = res.req.path.replace(/\//g, '.') + '-' + method + '-req';
    converted.parameters.push({
      schema: {
        '$ref': '#/definitions/' + definitionKey
      }
    })

    definition[definitionKey] = assignTypes(JSON.parse(res.req.body), true)
  }

  if (res.body) {
    var definitionKey = res.req.path.replace(/\//g, '.') + '-' + method + '-res';
    converted.responses[status]['schema'] = {
      '$ref': '#/definitions/' + definitionKey
    }

    definition[definitionKey] = {
      properties: assignTypes(JSON.parse(res.body))
    }
  }

  return {
    path: path,
    method: method,
    call: converted,
    definition: definition,
    definitionKey: definitionKey
  };
};

function filterHeaders(headers) {
  var headersWhitelist = ['content-type'],
      realHeaders = {};
  for (var header in headers) {
    var isRealHeader = !/x-.*/.test(header) &&
          !/x-swaggins-*/.test(header) &&
      headersWhitelist.indexOf(header) > -1;
    if(headers.hasOwnProperty(header) && isRealHeader) {
      realHeaders[header] = annotation.primitive(headers[header]);
    }
  }
  return realHeaders;
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

function assignTypes(obj, remove) {
  // TODO still have to recognise if obj is an array
  // in swagger-type-annotation

  // TODO we need to remove that ".properties" here
  // that's becase ALL object except the first
  // have the { type: 'object', properties: {} }
  // structure

  if (Array.isArray(obj)) return annotation.array(obj)

  return remove ? annotation.object(obj) : annotation.object(obj).properties;
}

function extractDocumentationHeaders(headers) {
  var result = {};
  for (var header in headers) {
    if (/x-swaggins-*/.test(header)) {
      result[header] = headers[header];
    }
  }
  return result;
}
