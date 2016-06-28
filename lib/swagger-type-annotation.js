var primitive = exports.primitive = (value) => {
  return { type: typeof value, example: value };
};

var isPrimitive = exports.isPrimitive = (o) => {
  var type = typeof o;
  return type == 'string' || type == 'number';
};

var array = exports.array = (arr) => {
  var result = { type: 'array', items: { } };

  if (isPrimitive(arr[0])) {
    result.items = primitive(arr[0]);
  } else {
    result.items = object(arr[0]);
  }

  return result;
};

var object = exports.object = (obj) => {
  var result = { type: 'object', properties: {} };

  for (var key in obj) {
    if (isPrimitive(obj[key])) {
      result.properties[key] = primitive(obj[key]);
    } else if (Array.isArray(obj[key])) {
      result.properties[key] = array(obj[key]);
    } else {
      result = { type: 'object', properties: result.properties };
      result.properties[key] = object(obj[key]);
    }
  }

  return result;
};
