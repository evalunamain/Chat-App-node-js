var http = require('http'),
static = require('node-static');

var file = new static.Server('./public');

var httpServer = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

httpServer.listen(8000);

var chatServer = require('./chat_server.js');
chatServer(httpServer);
