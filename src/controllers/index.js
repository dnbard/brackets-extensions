var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    RegistryDAL = require('../DAL/registry'),
    OnlineDAL = require('../DAL/online'),
    ApplicationDAL = require('../DAL/application'),
    HightlightDAL = require('../DAL/highlight'),
    CounterDAL = require('../DAL/counter'),
    Q = require('q'),
    Response = require('../response'),
    downloadsCounter = require('../services/downloadsCounter');

exports.default = function(req, res, next){
    Q.all([
        ExtensionDAL.getExtensionsCount(),
        ExtensionDAL.getNewestExtension(),
        ExtensionDAL.getMostDownloadsExtension(),
        ExtensionDAL.getMostDownloadsExtensionList(),
        RegistryDAL.getTags(),
        RegistryDAL.getAuthors(),
        RegistryDAL.getAuthorsCount(),
        OnlineDAL.get(),
        ExtensionDAL.getMostStaredExtensionList(),
        HightlightDAL.getCurrent(),
        CounterDAL.getLatestMonthTransfered(),
        CounterDAL.getTransfered(),
        CounterDAL.getTodayTransfered(),
        ExtensionDAL.getDailyDownloads()
    ]).then(_.bind(function(result){
        var count = result[0],
            newestExtension = result[1],
            downloadsExtension = result[2],
            downloadsExtensionList = result[3],
            tags = result[4],
            authors = result[5],
            authorsCount = result[6],
            extensionsOnline = result[7],
            extensionsStars = result[8],
            highlightedExtension = result[9],
            transferedData = result[10],
            overallTransferedData = result[11],
            todayTransferedData = result[12],
            downloadsCounter = result[13];

        var transferedDataFormated = {
            month: (transferedData.transfered / 1000000000).toFixed(1),
            overall: (overallTransferedData.transfered / 1000000000000).toFixed(2),
            today: (todayTransferedData.transfered / 1000000000).toFixed(1)
        };

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
            extensionsOnline: _.first(extensionsOnline, 12),
            extensionsStars: _.first(extensionsStars, 12),
            highlighted: highlightedExtension,
            transferedFormatted: `${transferedDataFormated.month} GB`,
            overallTransferedFormatted: `${transferedDataFormated.overall} TB`,
            todayTransferedFormatted: `${transferedDataFormated.today} GB`,
            downloadsCounter: downloadsCounter
        }));
    }, this), function(){
        res.status(500).send();
    });
}
