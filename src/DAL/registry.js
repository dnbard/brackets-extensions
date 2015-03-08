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

    _.each(this.defers, defer => defer.resolve(registry) );

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
    return {
        on: function(){},
        once: function(){},
        write: src => body += src,
        end: () => {
            console.log('Registry Updated');
            this.setRegistry(JSON.parse(body.replace('undefined', '').replace('null', '')));
            body = null;
        },
        emit: function(){}
    };
}

RegistryDAL.prototype.getExtensionsByTag = function(tag){
    var defer = Q.defer();

    this.getRegistry().then( registry => {
        var extensions = _.filter(registry, function(ext){
            return (ext.metadata.keywords || []).indexOf(tag) !== -1;
        });

        defer.resolve(extensions || []);
    });

    return defer.promise;
}

RegistryDAL.prototype.getTags = function(){
    return this.cached('extensionTags', () => {
        var defer = Q.defer(),
            extensionsWithTags,
            tags = {};

        this.getRegistry().then(registry => {
            extensionsWithTags = _.filter(registry, ext => ext.metadata.keywords);

            _.each(extensionsWithTags, ext => _.each(ext.metadata.keywords, tag => {
                if (tags[tag]){
                    tags[tag].count ++;
                } else {
                    tags[tag] = {
                        name:  tag,
                        count: 1
                    };
                }
            }));

            tags = _.chain(tags)
                .sortBy(tag => -tag.count)
                .toArray()
                .value();

            defer.resolve(tags);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.getTagsAsObject = function(){
    return this.cached('extensionTagsAsObject', () => {
        var defer = Q.defer();

        this.getTags().then(tags => {
            var formatedTags = {};

            _.each(tags, tag => formatedTags[tag.name] = tag.count);

            defer.resolve(formatedTags);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.getAuthors = function(){
    return this.cached('extensionAuthors', () => {
        var defer = Q.defer(),
            authors = {};

        //TODO: add `id` field to author model and calculate it's value
        //TODO: remove mail adress from author name
        this.getRegistry().then(registry => {
            _.each(registry, ext => {
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

            authors = _.chain(authors).sortBy(author => -author.count)
                .toArray()
                .first(25)
                .value();

            defer.resolve(authors);
        });

        return defer.promise;
    });
}

RegistryDAL.prototype.getAuthorsCount = function(){
    return this.cached('extensionAuthorsCount', () => {
        var defer = Q.defer();

        this.getRegistry().then(registry => {
            var authors = {};

            _.each(registry, ext => {
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

var a = false;

RegistryDAL.prototype.init = function(){
    var registryPath = config.registryPath;

    request({ url: registryPath })
        .pipe(zlib.createGunzip())
        .pipe(this.getPiper());

    setTimeout(() => this.init(), halfHour);

    a = true;
}

RegistryDAL.prototype.getExtension = function(id){
    var defer = Q.defer();

    this.getRegistry().then(registry => {
        defer.resolve(_.find(registry, ext => ext.metadata.name === id));
    });

    return defer.promise;
}

RegistryDAL.prototype.getThemeOfDay = function(){
     var defer = Q.defer();

    this.getRegistry().then(registry => {
        defer.resolve(_.sample(_.filter(registry, extension => extension.metadata && extension.metadata.theme)));
    });

    return defer.promise;
}

module.exports = new RegistryDAL();
