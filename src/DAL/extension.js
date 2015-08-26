var mongoose = require('mongoose'),
    Extension = mongoose.model('Extension'),
    BaseDAL = require('./base'),
    _ = require('lodash'),
    Q = require('q'),
    request = require('request');

function ExtensionDAL() {}

ExtensionDAL.prototype = new BaseDAL();

ExtensionDAL.prototype.setDailyDownloadCounter = function(ext, count){
    if (count === undefined || count == NaN){
        return console.log("Wrong DailyDownloadCounter calculation for %s", ext);
    }

    Extension.findOne({ _id: ext }, function(err, extension){
        extension.dailyDownloads = count || 0;
        extension.save();
    });
}

ExtensionDAL.prototype.getDailyDownloads = function(){
    return Extension.find()
        .sort({ dailyDownloads: -1 })
        .limit(12)
        .exec();
}

ExtensionDAL.prototype.getExtensionsCount = function () {
    return this.cached('extensionsCount', function () {
        return Extension.find({}).count().exec();
    });
}

ExtensionDAL.prototype.getAllExtensionIds = function () {
    return Extension.find({}).stream();
}

ExtensionDAL.prototype.getNewestExtension = function () {
    return this.cached('extensionNewest', function () {
        return Extension.findOne({}).sort({
            timestamp: -1
        }).lean().exec();
    });
}

ExtensionDAL.prototype.getNewestExtensions = function () {
    return this.cached('extensionsNewest', function () {
        return Extension.find({})
            .limit(12)
            .sort({ timestamp: -1 })
            .lean()
            .exec();
    });
}

ExtensionDAL.prototype.getMostDownloadsExtension = function () {
    return this.cached('extensionDownloads', function () {
        return Extension.findOne({
            faked: undefined
        }).sort({
            totalDownloads: -1
        }).lean().exec();
    });
}

ExtensionDAL.prototype.getMostDownloadsExtensionList = function () {
    return this.cached('extensionDownloadsList', function () {
        return Extension.find({
            faked: undefined
        }).sort({
            totalDownloads: -1
        }).limit(100).lean().exec();
    }, function (extensions) {
        var i = 0;

        return _.each(extensions, (extension) => extension.position = ++i);
    });
}

ExtensionDAL.prototype.getMostStaredExtensionList = function () {
    return this.cached('extensionStarsList', function () {
        return Extension.find({
            faked: undefined
        }).sort({
            stars: -1
        }).limit(12).lean().exec();
    }, function (extensions) {
        var i = 0;

        return _.each(extensions, (extension) => extension.position = ++i);
    });
}

ExtensionDAL.prototype.getExtension = function (id) {
    var defer = Q.defer();

    Extension.findOne({
        _id: id
    }).lean().exec().then(function (extension) {
        if (extension) {
            defer.resolve(extension);
        } else {
            defer.reject();
        }
    });

    return defer.promise;
}

//https://raw.githubusercontent.com/dnbard/brackets-documents-toolbar/master/readme.md
ExtensionDAL.prototype.getReadmeFile = function (id) {
    return this.getExtension(id).then((extension) => {
        var repository = extension.homepage,
            readmePathEndings = ['/master/README.md', '/master/Readme.md', '/master/readme.md'],
            endingIndex = 0,
            readmePathBase;

        if (!repository || repository.indexOf('https://github.com/') === -1) {
            return Promise.resolve(null);
        }

        readmePathBase = repository.replace('https://github.com/', 'https://raw.githubusercontent.com/');

        if (readmePathBase[readmePathBase.length - 1] === '/') {
            readmePathBase = readmePathBase.substring(0, readmePathBase.length - 1);
        }

        return new Promise((resolve, reject) => {
            function makeReadmeRequest(url) {
                request(url, (err, response, body) => {
                    if (err || body === 'Not Found') {
                        endingIndex++;

                        if (endingIndex === readmePathEndings.length) {
                            return resolve(null);
                        }

                        return makeReadmeRequest(readmePathBase + readmePathEndings[endingIndex]);
                    }

                    console.log('%s - %s', url, err);
                    return resolve(body.replace(/\/blob\//g, '/raw/'));
                });
            }

            makeReadmeRequest(readmePathBase + readmePathEndings[endingIndex]);
        });
    });
}

ExtensionDAL.prototype.getExtensionsByAuthor = function (id) {
    var defer = Q.defer();

    if (typeof id !== 'string' || id.length === 0) {
        defer.reject();
    } else {
        Extension.find({
            author: id
        }).sort({
            totalDownloads: -1
        }).lean().exec().then(function (extensions) {
            if (!_.isArray(extensions) || extensions.length === 0) {
                defer.reject();
            } else {
                defer.resolve(extensions);
            }
        });
    }

    return defer.promise;
}

ExtensionDAL.prototype.getExtensionByTitle = function (id, exact) {
    var defer = Q.defer(),
        query;

    if (exact === undefined) {
        exact = false;
    } else {
        exact = !!exact;
    }

    if (exact) {
        query = id;
    } else {
        query = new RegExp(id, 'i');
    }

    Extension.find({
        title: query
    }).sort({
        totalDownloads: -1
    }).lean().exec().then(function (extension) {
        if (extension) {
            defer.resolve(extension);
        } else {
            defer.reject();
        }
    });

    return defer.promise;
}

module.exports = new ExtensionDAL();
