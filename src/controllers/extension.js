var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    Q = require('q');

function ExtensionController(){}

ExtensionController.prototype.default = function(req, res, next){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        ExtensionDAL.getExtension(extensionId),
        RegistryDAL.getExtension(extensionId)
    ]).then(function(result){
        var extension = result[0],
            registryEntry = result[1];

        res.render('extension', {
            title : extension.title || extension.name,
            author: {
                name: extension.author.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim(),
                avatar: extension.authorAvatar || null,
                homepage: registryEntry.metadata.author.url || null
            },
            description: extension.description,
            github: {
                forks: extension.forks || null,
                stars: extension.stars || null
            },
            created: _.first(registryEntry.versions).published,
            latest: _.last(registryEntry.versions).published,
            totalDownloads: extension.totalDownloads,
            version: extension.version,
            homepage: extension.homepage,
            repository: extension.repository || extension.homepage,
            license: registryEntry.metadata.license,
            engines: registryEntry.metadata.engines || null,
            keywords: registryEntry.metadata.keywords || null,
            versions: registryEntry.versions ? _.clone(registryEntry.versions).reverse() : null
        });
    }, function(){
        res.status(500).send();
    });
}

module.exports = new ExtensionController();
