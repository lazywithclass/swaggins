var express = require('express'),
    app = express();

app.get('/answer/:about', function (req, res) {
  if (req.params.about === 'everything') res.send('42');
  else res.send(404);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
