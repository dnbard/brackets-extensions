var express = require('express'),
    config = require('./src/config'),
    middleware = require('./src/bootstrapMiddleware'),
    routing = require('./src/routing');

var app = express();

middleware(app);
routing(app);

app.listen(config.port);
