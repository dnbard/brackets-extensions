function Routing(app){
    if(!app){
        throw new Error('Invalid argument');
    }

    var index = require('./controllers/index'),
        extension = require('./controllers/extension'),
        downloads = require('./controllers/downloads'),
        author = require('./controllers/author'),
        tag = require('./controllers/tag');

    app.get('/', index.default);

    app.get('/extension/:id', extension.default);
    app.get('/extension/:id/downloads', downloads.default);

    app.get('/author/:id', author.default);

    app.get('/tag/:id', tag.default);
}

module.exports = Routing;
