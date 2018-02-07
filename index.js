import port from './src/app/port';
import fs from 'fs';

const ioPort = port; // Only using one port for this application

// If client files needed to information that we don't know at compile time,
// We could write it out to a config file and have the client file import it
fs.writeFile('./dist/config.js', 'portConfig = ' + JSON.stringify(
  {
    port: port,
    ioPort: ioPort
  }));

const express = require('express');
var app = express();
var server = require('http').createServer(app);

// Server the /dist directory
app.use(express.static('dist'));

server.listen(port);
