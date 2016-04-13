var express = require('express');
var app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.set('port', (process.env.PORT || 5000));


app.get('/', function(request, response) {
  response.json({ok: 1});
});


app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_secret_webhook_change_me') {
    res.send(req.query['hub.challenge']);
    return;
  }
  res.send('Error, wrong validation token');
});


app.post('/webhook/', function (req, res) {
  console.log('ZZZ:', req.body);

  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      // Handle a text message from this sender
      text = event.message.text;
      console.log('TEXT:', text);
    }
  }
  res.sendStatus(200);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
