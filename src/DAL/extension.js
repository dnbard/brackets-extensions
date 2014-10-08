var mongoose = require('mongoose'),
    Extension = mongoose.model('Extension'),
    baseDAL = require('./base'),
    _ = require('lodash');

function ExtensionDAL(){}

ExtensionDAL.prototype = baseDAL;

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
        return Extension.findOne({}).sort({totalDownloads: -1}).lean().exec();
    });
}

ExtensionDAL.prototype.getMostDownloadsExtensionList = function(){
    return this.cached('extensionDownloadsLIst', function(){
        return Extension.find({}).sort({totalDownloads: -1}).limit(100).lean().exec();
    }, function(extensions){
        var i = 0;

        return _.each(extensions, function(extension){
            extension.position = ++i;
        });
    });
}

module.exports = new ExtensionDAL();
