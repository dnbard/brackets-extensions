var express = require('express'),
    authorization = require('./middleware/authorization'),
    cookieParser = require('cookie-parser');

function BootstrapMiddleware(app){
    if (!app){
        throw new Error('Invalid argument');
    }

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');

    app.use(express.static(__dirname + '/../public'));

    app.use(cookieParser());
    app.use(authorization);
}

module.exports = BootstrapMiddleware;
