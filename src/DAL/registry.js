var baseDAL = require('./base'),
    _ = require('lodash'),
    config = require('../config'),
    request = require('request'),
    zlib = require('zlib'),
    Q = require('q'),
    halfHour = 1000 * 60 * 30,
    body;

function RegistryDAL(){
    this.storage = null;
    this.defers = [];

    this.init();
}

RegistryDAL.prototype = baseDAL;

RegistryDAL.prototype.setRegistry = function(registry){
    this.registry = registry;

    _.each(this.defers, function(defer){
        defer.resolve(this.registry);
    });
}

RegistryDAL.prototype.getRegistry = function(){
    var defer = Q.defer();

    if (this.registry){
        defer.resolve(this.registry);
    } else {
        this.defers.push(defer);
    }

    return defer.promise;
}

RegistryDAL.prototype.getPiper = function(){
    var self = this;

    return {
        on: function(){},
        once: function(){},
        write: function(src){ body += src; },
        end: function(){
            self.setRegistry(JSON.parse(body.replace('undefined', '')));
            body = null;
        },
        emit: function(){}
    };
}

RegistryDAL.prototype.getTags = function(){
    var self = this;

    return this.cached('extensionTags', function(){
        var defer = Q.defer(),
            extensionsWithTags,
            tags = {};

        self.getRegistry().then(function(registry){
            extensionsWithTags = _.filter(self.registry, function(ext){
                return ext.metadata.keywords;
            });

            console.log('%s extensions with tags', _.size(extensionsWithTags));

            _.each(extensionsWithTags, function(ext){
                _.each(ext.metadata.keywords, function(tag){
                    if (tags[tag]){
                        tags[tag].count ++;
                    } else {
                        tags[tag] = {
                            name:  tag,
                            count: 1
                        };
                    }
                });
            });

            tags = _.sortBy(tags, function(tag){
                return -tag.count;
            });

            tags = _.toArray(tags);

            tags = _.first(tags, 25);

            defer.resolve(tags);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.init = function(){
    var registryPath = config.registryPath;

    request({ url: registryPath })
        .pipe(zlib.createGunzip())
        .pipe(this.getPiper());

    setTimeout(_.bind(this.init, this), halfHour);
}

module.exports = new RegistryDAL();
