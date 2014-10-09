var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
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
        RegistryDAL.getAuthorsCount()
    ]).then(_.bind(function(result){
        var count = result[0],
            newestExtension = result[1],
            downloadsExtension = result[2],
            downloadsExtensionList = result[3],
            tags = result[4],
            authors = result[5],
            authorsCount = result[6];

        res.render('index', {
            title : 'Home',
            count: count,
            newestExtension: newestExtension,
            downloadsExtension: downloadsExtension,
            downloadsExtensionList: _.sortBy(_.sample(_.shuffle(downloadsExtensionList), 12), function(el){
                return -el.totalDownloads;
            }),
            tags: _.first(tags, 12),
            authors: _.first(authors, 12),
            authorsCount: authorsCount
        });
    }, this), function(){
        res.status(500).send();
    });
}

module.exports = new IndexController();
