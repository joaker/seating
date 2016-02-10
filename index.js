import ioserver from './server/ioserver';
import port from './src/app/port';
import fs from 'fs';

const ioPort = port; // Only using one port for this application

fs.writeFile('./dist/config.js', 'portConfig = ' + JSON.stringify(
  {
    port: port,
    ioPort: ioPort
  }));

const express = require('express');
var app = express();
var server = require('http').createServer(app);


// Create the IO server with the content server
ioserver.start(server);

// Server the /dist directory
app.use(express.static('dist'));

server.listen(port);
