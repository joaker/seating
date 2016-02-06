var connect = require('connect');
var serveStatic = require('serve-static');

var contentDir = __dirname + '/../dist'
connect().use(serveStatic(contentDir)).listen(8080);
