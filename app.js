var express = require('express'),
    config = require('./src/config'),
    middleware = require('./src/bootstrapMiddleware'),
    routing = require('./src/routing'),
    winston = require('winston');

var app = express();

middleware(app);
routing(app);

app.listen(config.port);
winston.info('Application started at %d', config.port);
