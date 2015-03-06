var Q = require('q'),
    cache = require('../services/cache');

function BaseDAL(){}

BaseDAL.prototype.cached = function(){
    var key, handler, afterHandler, invalidate;

    if (arguments.length === 1){
        key = arguments[0].key;
        handler = arguments[0].handler;
        afterHandler = arguments[0].afterHandler;
        invalidate = arguments[0].invalidate || null;
    } else {
        key = arguments[0];
        handler = arguments[1];
        afterHandler = arguments[2];
        invalidate = arguments[3] || null;
    }

    if (typeof key !== 'string' || typeof handler !== 'function'){
        throw new Error('Invalid argument');
    }

    var defer = Q.defer(),
        cachedValue = cache.get(key);

    if (cachedValue){
        defer.resolve(cachedValue);
    } else {
        handler().then(value => {
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

module.exports = BaseDAL;
