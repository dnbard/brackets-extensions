var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    ApplicationDAL = require('../DAL/application')
    Q = require('q');

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
        ApplicationDAL.usersCount()
    ]).then(_.bind(function(result){
        var count = result[0],
            newestExtension = result[1],
            downloadsExtension = result[2],
            downloadsExtensionList = result[3],
            tags = result[4],
            authors = result[5],
            authorsCount = result[6],
            online = result[7];

        res.render('index', {
            title : 'Home',
            count: count,
            newestExtension: newestExtension,
            downloadsExtension: downloadsExtension,
            downloadsExtensionList: _.sortBy(_.sample(_.shuffle(downloadsExtensionList), 12), function(el){
                return -el.totalDownloads;
            }),
            tags: _.first(tags, 12),
            authors: _.map(_.first(authors, 12),function(author){
                author.name = author.name.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim();
                return author;
            }),
            authorsCount: authorsCount,
            online: online
        });
    }, this), function(){
        res.status(500).send();
    });
}

module.exports = new IndexController();
