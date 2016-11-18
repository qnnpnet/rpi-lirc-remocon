var FauxMo = require('fauxmojs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 2002;
var exec = require('child_process').exec;

// Creates the website server on the port #
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Express Routing
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

var sendCommand = function(command) {
  console.log(command);
  exec("irsend SEND_ONCE ollehtv " + command);
};

// WEMO virtual device
var fauxMo = new FauxMo({
  devices: [
    {
      name: 'tv',
      port: 11000,
      handler: function(action) {
        console.log('tv action:', action);
        setTimeout(function() {
          sendCommand("KEY_SETTOPPOWER");
        }, 200);
      }
    }
  ]
});

// Handles the route for echo apis
app.get('/api/remocon', function(req, res) {
  console.log("received echo request");
  sendCommand(req.query.command);
});
