var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botDoc = /^\/doc$/,
      botBoo = /boo ya/i;

  if(request.text && botDoc.test(request.text)) {
    this.res.writeHead(200);
    postMessage(1);
    this.res.end();
  } else if(request.text && botBoo.test(request.text)) {
    this.res.writeHead(200);
    postMessage(2);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(messageNum) {
  var botResponse, options, body, botReq;
  if(messageNum == 1) {
    botResponse = "https://docs.google.com/spreadsheets/d/1e0jENW050_hYYYCNjzyY0chYM2V-WIhtEBCGjXMQuUk";
  } else if(messageNum == 2) {
    botResponse = "Now we're talking!";
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
