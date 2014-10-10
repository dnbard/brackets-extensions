function Routing(app){
    if(!app){
        throw new Error('Invalid argument');
    }

    var index = require('./controllers/index'),
        extension = require('./controllers/extension');

    app.get('/', index.default);

    app.get('/extension/:id', extension.default);
}

module.exports = Routing;
