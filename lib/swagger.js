var fs = require('fs');

exports.write = (data) => {
  var file = 'swagger.json',
      json = fs.readFileSync(file, 'utf8');

  if (!json) json = header();
  if (!json.paths) json.paths = {};

  json.paths[data.url] = {};
  json.paths[data.url][normaliseMethod(data.method)] = {};

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};

function header() {
  return  {
    swagger: '2',
    info: {
      version: '?.?.?',
      title: ''
    }
  }
}

function normaliseMethod(method) {
  return method.toLowerCase();
}
