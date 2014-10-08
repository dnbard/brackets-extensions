var Q = require('q'),
    cache = require('../services/cache');

function BaseDAL(){}

BaseDAL.prototype.cached = function(key, handler, afterHandler){
    if (typeof key !== 'string' || typeof handler !== 'function' || afterHandler && typeof afterHandler !== 'function'){
        throw new Error('Invalid argument');
    }

    var defer = Q.defer(),
        cachedValue = cache.get(key);

    if (cachedValue){
        defer.resolve(cachedValue);
    } else {
        handler().then(function(value){
            if (typeof afterHandler === 'function'){
                afterHandler(value);
            }

            cache.set(key, value);
            defer.resolve(value);
        }, function(err){
            defer.reject(err);
        });
    }

    return defer.promise;
}

module.exports = new BaseDAL();
