var winston = require('winston'),
    ExtensionDAL = require('../DAL/extension'),
    Q = require('q');

function IndexController(){}

IndexController.prototype.default = this.default = function(req, res, next){
    Q.all([ExtensionDAL.getExtensionsCount()]).then(function(results){
        var count = results[0];

        res.render('index', {
            title : 'Home',
            count: count
        });
    }, function(){
        res.status(500).send();
    });
}

module.exports = new IndexController();
