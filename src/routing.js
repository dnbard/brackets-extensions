function Routing(app){
    if(!app){
        throw new Error('Invalid argument');
    }

    app.get('/', function (req, res) {
        res.render('index',
            { title : 'Home' }
        );
    });
}

module.exports = Routing;
