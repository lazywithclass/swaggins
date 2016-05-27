// SWAGGER SCHEMA
// {
//   paths: {
//     path: {
//       verb: {
//         responses: {}
//         parameters: []
//       }
//     }
//   }
// }


var fs = require('fs');

exports.write = (data) => {
  var file = 'swagger.json',
      json = fs.readFileSync(file, 'utf8');

  if (!json) json = {};
  if (!json.paths) json.paths = {};

  json.paths[data.url] = {};
  json.paths[data.url][data.method] = {};

  fs.writeFileSync(file, JSON.stringify(json, null, '  '));
};
