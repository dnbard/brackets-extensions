function Routing(app){
    if(!app){
        throw new Error('Invalid argument');
    }

    var index = require('./controllers/index');

    app.get('/', index.default);
}

module.exports = Routing;
