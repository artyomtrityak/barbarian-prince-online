var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));


app.get('/', function(request, response) {
  response.json({ok: 1});
});


app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_secret_webhook_change_me') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
