var BaseDAL = require('./base'),
    _ = require('lodash'),
    config = require('../config'),
    request = require('request'),
    Q = require('q'),
    mongoose = require('mongoose'),
    Service = null,
    dataRequireInterval = 1000 * 10,
    RegistryDAL = require('./registry'),
    EventEmitter = require('events').EventEmitter,
    util = require('util');

function OnlineDAL(){
    EventEmitter.call(this);

    this.registry = {};
    this.defers = [];

    this.init();
}

OnlineDAL.prototype = new BaseDAL();
util.inherits(OnlineDAL, EventEmitter);

OnlineDAL.prototype.set = function(registry){
    var registryIds = _.map(registry, function(ext){
        return ext.name;
    });

    _.remove(this.registry, ext => _.contains(registryIds, ext.name));

    this.registry = _(registry)
        .extend(this.registry)
        .sortBy(ext => -ext.online)
        .value();

    _.each(this.registry, extensionOnlineInfo => {
        if (!extensionOnlineInfo.title){
            RegistryDAL.getExtension(extensionOnlineInfo.name)
                .then(extension => extensionOnlineInfo.title = extension.metadata.title );
        }
    });

    _.each(this.defers, defer => defer.resolve(this.registry) );

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
    var registryPath = config.registryPath;

    if (!Service){
        Service = mongoose.model('Service');
    }

    Service.find({type: 'tracking'})
        .lean()
        .exec()
        .then( services => {
            _.each(services, service => {
                this.trackingServiceHandler(service)
                    .then(data => this.set(data),
                          e => console.log(e));
            });

            console.log('Online data updated');
            this.emit('updated', this.registry);
        });

    setTimeout(() => this.init(), dataRequireInterval);
}

OnlineDAL.prototype.trackingServiceHandler = function(service){
    var defer = Q.defer();

    request(service.url + 'stats', (error, response, body) => {
        if (error){
            console.error(error);
            defer.reject({});
        }

        try{
            var stats = JSON.parse(body),
                statsReg = {};

            _.each(stats, stat => {
                if (stat.online && stat.maxUsers){
                    statsReg[stat.name] = stat;
                }
            });

            defer.resolve(statsReg);
        }catch(e){
            defer.reject(e);
        }
    });

    return defer.promise;
}

module.exports = new OnlineDAL();
