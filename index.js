var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.set('port', (process.env.PORT || 5000));





var token = "";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}




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
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
