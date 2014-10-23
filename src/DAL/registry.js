var BaseDAL = require('./base'),
    _ = require('lodash'),
    config = require('../config'),
    request = require('request'),
    zlib = require('zlib'),
    Q = require('q'),
    halfHour = 1000 * 60 * 30,
    body;

function RegistryDAL(){
    this.registry = null;
    this.defers = [];

    this.init();
}

RegistryDAL.prototype = new BaseDAL();

RegistryDAL.prototype.setRegistry = function(registry){
    if (!registry){
        return;
    }

    this.registry = registry;

    _.each(this.defers, function(defer){
        defer.resolve(registry);
    });

    this.defers = [];
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
            console.log('Registry Updated');
            self.setRegistry(JSON.parse(body.replace('undefined', '').replace('null', '')));
            body = null;
        },
        emit: function(){}
    };
}

RegistryDAL.prototype.getExtensionsByTag = function(tag){
    var self = this,
        defer = Q.defer();

    self.getRegistry().then(function(registry){
        var extensions = _.filter(registry, function(ext){
            return (ext.metadata.keywords || []).indexOf(tag) !== -1;
        });

        defer.resolve(extensions || []);
    });

    return defer.promise;
}

RegistryDAL.prototype.getTags = function(){
    var self = this;

    return this.cached('extensionTags', function(){
        var defer = Q.defer(),
            extensionsWithTags,
            tags = {};

        self.getRegistry().then(function(registry){
            extensionsWithTags = _.filter(registry, function(ext){
                return ext.metadata.keywords;
            });

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

            defer.resolve(tags);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.getTagsAsObject = function(){
    var self = this;

    return this.cached('extensionTagsAsObject', function(){
        var defer = Q.defer();

        self.getTags().then(function(tags){
            var formatedTags = {};

            _.each(tags, function(tag){
                formatedTags[tag.name] = tag.count;
            });

            defer.resolve(formatedTags);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.getAuthors = function(){
    var self = this;

    return this.cached('extensionAuthors', function(){
        var defer = Q.defer(),
            authors = {};

        //TODO: add `id` field to author model and calculate it's value
        //TODO: remove mail adress from author name
        self.getRegistry().then(function(registry){
            _.each(registry, function(ext){
                if (!ext.metadata || !ext.metadata.author || !ext.metadata.author.name){
                    return true;
                }

                var author = ext.metadata.author.name;
                if (authors[author]){
                    authors[author].count ++;
                } else {
                    authors[author] = {
                        name:  author,
                        count: 1
                    };
                }
            });

            authors = _.sortBy(authors, function(author){
                return -author.count;
            });

            authors = _.toArray(authors);

            authors = _.first(authors, 25);

            defer.resolve(authors);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.getAuthorsCount = function(){
    var self = this;

    return this.cached('extensionAuthorsCount', function(){
        var defer = Q.defer(),
            authors = {};

        self.getRegistry().then(function(registry){
            _.each(registry, function(ext){
                if (!ext.metadata || !ext.metadata.author || !ext.metadata.author.name){
                    return true;
                }

                var author = ext.metadata.author.name;
                if (authors[author]){
                    authors[author].count ++;
                } else {
                    authors[author] = {
                        name:  author,
                        count: 1
                    };
                }
            });

            defer.resolve(_.size(authors));
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

RegistryDAL.prototype.getExtension = function(id){
    var defer = Q.defer();

    this.getRegistry().then(function(registry){
        defer.resolve(_.find(registry, function(ext){
            return ext.metadata.name === id;
        }));
    });

    return defer.promise;
}

RegistryDAL.prototype.getThemeOfDay = function(){
     var defer = Q.defer();

    this.getRegistry().then(function(registry){
        defer.resolve(_.sample(_.filter(registry, function(extension){
            return extension.metadata && extension.metadata.theme;
        })));
    });

    return defer.promise;
}

module.exports = new RegistryDAL();
