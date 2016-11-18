var express = require('express'),
    app = express(),
    jsonparser = require('body-parser').json({ type: 'application/*'});

app.use(jsonparser);

app.get('/answer/:about', function (req, res) {
  if (req.params.about === 'everything') res.send('42');
  else res.send(404);
});

app.post('/answer/math', function(req, res) {
  var solvedExpressions = req.body.expressions.map(function(expression) {
    return eval(expression);
  });
  res.json(solvedExpressions).status(201);
});


var db = {};

app.get('/db', function(req, res) {
  res.status(200).json({ items: db });
});

app.post('/db', function(req, res) {
  db[req.body.item.key] = req.body.item.value;
  res.status(201).json({ newitem: req.body.item });
});

app.get('/db/:id', function(req, res) {
  res.status(200).json({
    item: { key: parseInt(req.params.id, 10), value: db[req.params.id] }
  });
});

app.put('/db/:id', function(req, res) {
  db[req.params.id] = req.body.newvalue;
  res.status(200).json({
    item: { key: parseInt(req.params.id, 10), value: db[req.params.id] }
  });
});

app.delete('/db/:id', function(req, res) {
  delete db[req.params.id];
  res.status(200).json({});
});

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});
