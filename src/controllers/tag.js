var _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    Q = require('q'),
    Response = require('../response');

function TagController(){}

TagController.prototype.default = function(req, res, next){
    var tagId = req.params.id;

    function NotFoundResponse(){
        res.render('not-found',{
            title: 'Tag not found',
            type: 'Tag',
            id: tagId,
            user: req.user
        });
    }

    if (!tagId){
        NotFoundResponse();
        return;
    }

    RegistryDAL.getExtensionsByTag(tagId).then(function(rawExts){
        var exts = _.map(rawExts, function(rawExt){
            return ExtensionDAL.getExtension(rawExt.metadata.name);
        });

        Q.all(exts).then(function(results){
            var extensions = results;

            res.render('tag', new Response(req, {
                title: tagId + ' tag',
                tag: tagId,
                extensions: extensions,
                user: req.user
            }));
        }, NotFoundResponse);
    }, NotFoundResponse);
}

module.exports = new TagController();
