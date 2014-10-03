var express = require('express');

function BootstrapMiddleware(app){
    if (!app){
        throw new Error('Invalid argument');
    }

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');

    app.use(express.static(__dirname + '/../public'));
}

module.exports = BootstrapMiddleware;
