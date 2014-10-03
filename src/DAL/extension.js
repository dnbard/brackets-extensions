var mongoose = require('mongoose'),
    Extension = mongoose.model('Extension'),
    cache = require('../services/cache'),
    Q = require('q'),
    winston = require('winston');

function ExtensionDAL(){}

ExtensionDAL.prototype.getExtensionsCount = function(){
    var cachedValue = cache.get('extensionsCount'),
        defer = Q.defer();

    if (cachedValue){
        winston.info('Cached value "%s" used', 'extensionsCount');

        defer.resolve(cachedValue);
    } else {
        Extension.find({}).count().exec().then(function(count){
            cache.set('extensionsCount', count);
            defer.resolve(count);
        }, function(err){
            defer.reject(err);
        });
    }

    return defer.promise;
}

module.exports = new ExtensionDAL();
