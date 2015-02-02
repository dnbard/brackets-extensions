var mongoose = require('mongoose'),
    Extension = mongoose.model('Extension'),
    BaseDAL = require('./base'),
    _ = require('lodash'),
    Q = require('q');

function ExtensionDAL(){}

ExtensionDAL.prototype = new BaseDAL();

ExtensionDAL.prototype.getExtensionsCount = function(){
    return this.cached('extensionsCount', function(){
        return Extension.find({}).count().exec();
    });
}

ExtensionDAL.prototype.getNewestExtension = function(){
    return this.cached('extensionNewest', function(){
        return Extension.findOne({}).sort({timestamp: -1}).lean().exec();
    });
}

ExtensionDAL.prototype.getMostDownloadsExtension = function(){
    return this.cached('extensionDownloads', function(){
        return Extension.findOne({ faked: undefined }).sort({totalDownloads: -1}).lean().exec();
    });
}

ExtensionDAL.prototype.getMostDownloadsExtensionList = function(){
    return this.cached('extensionDownloadsList', function(){
        return Extension.find({ faked: undefined }).sort({totalDownloads: -1}).limit(100).lean().exec();
    }, function(extensions){
        var i = 0;

        return _.each(extensions, function(extension){
            extension.position = ++i;
        });
    });
}

ExtensionDAL.prototype.getMostStaredExtensionList = function(){
    return this.cached('extensionStarsList', function(){
        return Extension.find({}).sort({stars: -1}).limit(12).lean().exec();
    }, function(extensions){
        var i = 0;

        return _.each(extensions, function(extension){
            extension.position = ++i;
        });
    });
}

ExtensionDAL.prototype.getExtension = function(id){
    var defer = Q.defer();

    Extension.findOne({_id: id}).lean().exec().then(function(extension){
        if (extension){
            defer.resolve(extension);
        } else {
            defer.reject();
        }
    });

    return defer.promise;
}

ExtensionDAL.prototype.getExtensionsByAuthor = function(id){
    var defer = Q.defer();

    if (typeof id !== 'string' || id.length === 0){
        defer.reject();
    } else {
        Extension.find({author:id}).sort({totalDownloads: -1}).lean().exec().then(function(extensions){
            if (!_.isArray(extensions) || extensions.length === 0){
                defer.reject();
            } else {
                defer.resolve(extensions);
            }
        });
    }

    return defer.promise;
}

ExtensionDAL.prototype.getExtensionByTitle = function(id, exact){
    var defer = Q.defer(),
        query;

    if (exact === undefined){
        exact = false;
    } else {
        exact = !!exact;
    }

    if (exact){
        query = id;
    } else {
        query = new RegExp(id, 'i');
    }

    Extension.find({title: query}).sort({totalDownloads: -1}).lean().exec().then(function(extension){
        if (extension){
            defer.resolve(extension);
        } else {
            defer.reject();
        }
    });

    return defer.promise;
}

module.exports = new ExtensionDAL();
