module.exports = (res) => {
  var req = res.req;
  var collected = {
    url: req.path,
    method: req.method,
    headers: req.headers,
    statusCode: res.statusCode,
    body: res.body
  };
  return collected;
};
