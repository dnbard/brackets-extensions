//initialize babeljs.io require hook
require("babel/register");

var config = require('./src/config');

var express = require('express'),
    middleware = require('./src/bootstrapMiddleware'),
    models = require('./src/bootstrapModels'),
    services = require('./src/bootstrapServices'),
    routing = require('./src/routing'),
    WebSocketServer = require('ws').Server,
    WebSocketService = require('./src/services/websockets');

const app = express();

middleware(app);
services();
routing(app);

const server = app.listen(config.port, function(){
    console.log('Application started at port %d', config.port);
});
