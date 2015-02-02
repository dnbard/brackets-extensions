var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    OnlineDAL = require('../DAL/online'),
    Q = require('q'),
    Response = require('../response'),
    converters = require('../services/converters');

function ExtensionController(){}

ExtensionController.prototype.default = function(req, res, next){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        ExtensionDAL.getExtension(extensionId),
        RegistryDAL.getExtension(extensionId),
        RegistryDAL.getTagsAsObject(),
        OnlineDAL.get()
    ]).then(function(result){
        var extension = result[0],
            registryEntry = result[1],
            tags = result[2],
            dailyUsers = converters.dailyUsers(_.find(result[3], function(app){
                return app.name === extensionId;
            }));

        res.render('extension', new Response(req, {
            id: extension._id,
            title : extension.title || extension.name,
            author: {
                name: extension.author.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim(),
                link: extension.author,
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
            versions: registryEntry.versions ? _.clone(registryEntry.versions).reverse() : null,
            tags: tags,
            user: req.user,
            dailyUsers: dailyUsers,
            isFaked: !!extension.faked
        }));
    }, function(){
        res.render('not-found', new Response(req, {
            title: 'Extension not found',
            type: 'Extension',
            id: extensionId
        }));
    });
}

module.exports = new ExtensionController();
