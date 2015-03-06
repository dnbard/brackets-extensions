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
    winston = require('winston'),
    mongoose = require('mongoose'),
    HerokuUnsleep = require('./src/services/heroku');

var app = express();

models();

mongoose.connect(config.database, function(){
    winston.info('Connected to database');

    middleware(app);
    services();
    routing(app);

    app.listen(config.port, function(){
        var herokuUnsleep;

        winston.info('Application started at port %d', config.port);

        herokuUnsleep = new HerokuUnsleep();
    });
});
