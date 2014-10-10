var express = require('express'),
    authorization = require('./middleware/authorization'),
    cookieParser = require('cookie-parser'),
    ready = require('./middleware/ready'),
    morgan = require('morgan');

function BootstrapMiddleware(app){
    if (!app){
        throw new Error('Invalid argument');
    }

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');

    app.use(morgan('dev'));
    app.use(express.static(__dirname + '/../public'));

    app.use(ready);
    app.use(cookieParser());
    app.use(authorization);
}

module.exports = BootstrapMiddleware;
