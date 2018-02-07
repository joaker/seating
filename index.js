import port from './src/app/port';
import fs from 'fs';

const express = require('express');
var app = express();
var server = require('http').createServer(app);

// Server the /dist directory
app.use(express.static('dist'));

server.listen(port);
