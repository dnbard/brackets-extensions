var _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    Q = require('q');

function TagController(){}

TagController.prototype.default = function(req, res, next){
    var tagId = req.params.id;

    if (!tagId){
        res.status(500).send();
        return;
    }

    RegistryDAL.getExtensionsByTag(tagId).then(function(rawExts){
        var exts = _.map(rawExts, function(rawExt){
            return ExtensionDAL.getExtension(rawExt.metadata.name);
        });

        Q.all(exts).then(function(results){
            var extensions = results;

            res.render('tag',{
                title: tagId + ' tag',
                tag: tagId,
                extensions: extensions
            });
        }, function(){
            res.status(500).send();
        });
    });
}

module.exports = new TagController();
