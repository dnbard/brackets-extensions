var _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    Q = require('q');

function SearchController(){}

SearchController.prototype.default = function(req, res){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        ExtensionDAL.getExtensionByRegex(extensionId)
    ]).then(function(results){
        var extensions = results[0];

        console.log(_.first(extensions));

        res.render('search',{
            title: extensionId + ' extensions',
            extensions: extensions,
            search: extensionId,
            notFound: _.size(extensions) === 0
        });
    });
}

module.exports = new SearchController();
