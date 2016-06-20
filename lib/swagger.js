var fs = require('fs'),
    touch = require('touch')


exports.write = (data) => {
  var file = 'swagger.json';
  touch.sync(file);
  var json = fs.readFileSync(file, 'utf8');
  json = json ? JSON.parse(json) : init();

  json.paths[data.url] = {};
  json.paths[data.url][normaliseMethod(data.method)] = {};

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};

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
