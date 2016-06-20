var express = require('express'),
    app = express();

app.get('/scoreboard', function (req, res) {
  res.status(200).json({});
});

app.post('/scoreboard', function(req, res) {
  res.setHeader('x-server-load', 'ok');
  res.status(201).json({});
});

app.listen(3000);
