function Routing(app){
    if(!app){
        throw new Error('Invalid argument');
    }

    var index = require('./controllers/index'),
        about = require('./controllers/about'),
        extension = require('./controllers/extension'),
        extensions = require('./controllers/extensions'),
        downloads = require('./controllers/downloads'),
        author = require('./controllers/author'),
        tag = require('./controllers/tag'),
        search = require('./controllers/search'),
        sso = require('./controllers/sso'),
        user = require('./controllers/user'),
        articles = require('./controllers/articles');

    app.get('/', index.default);

    app.get('/about', about.default);

    app.get('/extensions', extensions.default);
    app.get('/extensions/featured', extensions.featured);

    app.get('/extension/:id', extension.default);
    app.get('/extension/:id/downloads', downloads.default);

    app.get('/author/:id', author.default);

    app.get('/tag/:id', tag.default);

    app.get('/search/:id', search.default);

    app.get('/loggedin', sso.github);

    app.get('/dashboard', user.default);

    app.get('/blog', articles.all);
    app.get('/article/:alias', articles.default);
}

module.exports = Routing;
