var express = require('express'),
    config = require('./src/config'),
    middleware = require('./src/bootstrapMiddleware'),
    routing = require('./src/routing'),
    winston = require('winston'),
    mongoose = require('mongoose');

var app = express();

middleware(app);
routing(app);

mongoose.connect(config.database, function(){
    winston.info('Connected to database');
    app.listen(config.port, function(){
        winston.info('Application started at port %d', config.port);
    });
});
