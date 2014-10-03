function CacheService(){
    this.storage = {};
    this.defaultInvalidate = 900000 /* ms OR 15 mins */;
}

CacheService.prototype.get = function(key, invalidate){
    var now = new Date().getTime(),
        entity = this.storage[key];

    invalidate = invalidate || this.defaultInvalidate;

    if (entity){
        if (now - entity.timestamp < invalidate){
            return entity.value;
        } else {
            delete this.storage[key];
        }
    }

    return null;
}

CacheService.prototype.set = function(key, value){
    var now = new Date().getTime();

    this.storage[key] = {
        timestamp: now,
        value: value
    };
}

module.exports = new CacheService();
