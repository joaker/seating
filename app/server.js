import express from 'express';
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var port = process.env.PORT || 8080;

server.listen(port);

var contentDir = __dirname + '/../dist'

app.use(express.static(contentDir));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// var connect = require('connect');
// var serveStatic = require('serve-static');
//
// var contentDir = __dirname + '/../dist'
// connect().use(serveStatic(contentDir)).listen();
