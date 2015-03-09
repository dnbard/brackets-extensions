var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    OnlineDAL = require('../DAL/online'),
    Q = require('q'),
    Response = require('../response'),
    converters = require('../services/converters');

exports.default = function(req, res, next){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        ExtensionDAL.getExtension(extensionId),
        RegistryDAL.getExtension(extensionId),
        RegistryDAL.getTagsAsObject(),
        OnlineDAL.get(),
        ExtensionDAL.getMostDownloadsExtensionList()
    ]).then(result => {
        var extension = result[0],
            registryEntry = result[1],
            tags = result[2],
            dailyUsers = converters.dailyUsers(_.find(result[3], app => app.name === extensionId)),
            topExtensions = result[4],
            thisExtensionInTopList = _.find(topExtensions, (ext) => ext._id === extension._id),
            position = thisExtensionInTopList && thisExtensionInTopList.position ? thisExtensionInTopList.position : null;

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
            isFaked: !!extension.faked,
            position: position
        }));
    }, () => {
        res.render('not-found', new Response(req, {
            title: 'Extension not found',
            type: 'Extension',
            id: extensionId
        }));
    });
}
