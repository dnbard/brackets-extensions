var BaseDAL = require('./base'),
    _ = require('lodash'),
    config = require('../config'),
    request = require('request'),
    Q = require('q'),
    mongoose = require('mongoose'),
    Service = null,
    dataRequireInterval = 1000 * 60 * 10,
    RegistryDAL = require('./registry');

function OnlineDAL(){
    this.registry = {};
    this.defers = [];

    this.init();
}

OnlineDAL.prototype = new BaseDAL();

OnlineDAL.prototype.set = function(registry){
    var registryIds = _.map(registry, function(ext){
        return ext.name;
    });

    //console.log('New registry size - ', _.size(registry));
    //console.log('Online size before removing - %s', _.size(this.registry));

    _.remove(this.registry, function(ext){
        return _.contains(registryIds, ext.name);
    });

    //console.log('Online size after removing - %s', _.size(this.registry));

    this.registry = _(registry)
        .extend(this.registry)
        .sortBy(function(ext){
        return - ext.online;
    }).value();

    //console.log('Online size after concatenating - %s', _.size(this.registry));

    _.each(this.registry, function(extensionOnlineInfo){
        if (!extensionOnlineInfo.title){
            RegistryDAL.getExtension(extensionOnlineInfo.name).then(function(extension){
                extensionOnlineInfo.title = extension.metadata.title;
            });
        }
    });

    _.each(this.defers, function(defer){
        defer.resolve(this.registry);
    });

    this.defers = [];
}

OnlineDAL.prototype.get = function(){
    var defer = Q.defer();

    if (this.registry){
        defer.resolve(this.registry);
    } else {
        this.defers.push(defer);
    }

    return defer.promise;
}

OnlineDAL.prototype.init = function(){
    var registryPath = config.registryPath,
        self = this;

    if (!Service){
        Service = mongoose.model('Service');
    }

    Service.find({type: 'tracking'}).lean().exec().then(function(services){
        _.each(services, function(service){
            self.trackingServiceHandler(service).then(function(data){
                self.set(data);
            });
        });
    });

    setTimeout(_.bind(this.init, this), dataRequireInterval);
}

OnlineDAL.prototype.trackingServiceHandler = function(service){
    var defer = Q.defer();

    request(service.url + 'stats', function(error, response, body){
        if (error){
            console.error(error);
            defer.reject({});
        }

        var stats = JSON.parse(body),
            statsReg = {};

        _.each(stats, function(stat){
            if (stat.online && stat.maxUsers){
                statsReg[stat.name] = stat;
            }
        });

        defer.resolve(statsReg);
    });

    return defer.promise;
}

module.exports = new OnlineDAL();
