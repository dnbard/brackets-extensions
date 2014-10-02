var express = require('express'),
    config = require('./src/config'),
    middleware = require('./src/bootstrapMiddleware');

var app = express();

middleware(app);

app.get('/', function (req, res) {
    res.render('index',
        { title : 'Home' }
    );
});

app.listen(config.port);
