var _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    Q = require('q'),
    Response = require('../response');

function SearchController(){}

SearchController.prototype.default = function(req, res){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        ExtensionDAL.getExtensionByTitle(extensionId)
    ]).then(function(results){
        var extensions = results[0];

        res.render('search', new Response(req, {
            title: extensionId + ' extensions',
            extensions: extensions,
            search: extensionId,
            notFound: _.size(extensions) === 0,
            user: req.user
        }));
    });
}

module.exports = new SearchController();
