//initialize babeljs.io require hook
require("babel/register");

var config = require('./src/config');

if (config.env === 'prod'){
    require('newrelic');
}

var express = require('express'),
    middleware = require('./src/bootstrapMiddleware'),
    models = require('./src/bootstrapModels'),
    services = require('./src/bootstrapServices'),
    routing = require('./src/routing'),
    mongoose = require('mongoose'),
    HerokuUnsleep = require('./src/services/heroku'),
    WebSocketServer = require('ws').Server,
    WebSocketService = require('./src/services/websockets');

var app = express();

models();

mongoose.connect(config.database, function(){
    console.info('Connected to database');

    middleware(app);
    services();
    routing(app);

    var server = app.listen(config.port, function(){
        var herokuUnsleep, wss;

        console.log('Application started at port %d', config.port);

        wss = new WebSocketServer({server: server});
        WebSocketService.init(wss);
        console.log('WebSocket Server Started at top of Express');

        herokuUnsleep = new HerokuUnsleep();
    });
});
