var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    OnlineDAL = require('../DAL/online'),
    ApplicationDAL = require('../DAL/application'),
    HightlightDAL = require('../DAL/highlight'),
    Q = require('q'),
    Response = require('../response');

function IndexController(){}

IndexController.prototype.default = function(req, res, next){
    Q.all([
        ExtensionDAL.getExtensionsCount(),
        ExtensionDAL.getNewestExtension(),
        ExtensionDAL.getMostDownloadsExtension(),
        ExtensionDAL.getMostDownloadsExtensionList(),
        RegistryDAL.getTags(),
        RegistryDAL.getAuthors(),
        RegistryDAL.getAuthorsCount(),
        ApplicationDAL.usersCount(),
        OnlineDAL.get(),
        ExtensionDAL.getMostStaredExtensionList(),
        HightlightDAL.getCurrent()
    ]).then(_.bind(function(result){
        var count = result[0],
            newestExtension = result[1],
            downloadsExtension = result[2],
            downloadsExtensionList = result[3],
            tags = result[4],
            authors = result[5],
            authorsCount = result[6],
            usersOnline = result[7],
            extensionsOnline = result[8],
            extensionsStars = result[9],
            highlightedExtension = result[10];

        res.render('index', new Response(req, {
            title : 'Home',
            count: count,
            newestExtension: newestExtension,
            downloadsExtension: downloadsExtension,
            downloadsExtensionList: _.sortBy(_.sample(_.shuffle(downloadsExtensionList), 12), function(el){
                return -el.totalDownloads;
            }),
            tags: _.first(tags, 12),
            authors: _.map(_.first(authors, 12),function(author){
                author.link = author.name;
                author.name = author.name.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim();
                return author;
            }),
            authorsCount: authorsCount,
            online: usersOnline,
            extensionsOnline: _.first(extensionsOnline, 12),
            extensionsStars: _.first(extensionsStars, 12),
            highlighted: highlightedExtension
        }));
    }, this), function(){
        res.status(500).send();
    });
}

module.exports = new IndexController();
