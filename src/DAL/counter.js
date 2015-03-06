var mongoose = require('mongoose'),
    BaseDAL = require('./base'),
    Q = require('q'),
    _ = require('lodash'),
    Counter = mongoose.model('Counter'),
    JSONSize = 665000;

function CounterDAL(){}

CounterDAL.prototype = new BaseDAL();

CounterDAL.prototype.getLatestMonthTransfered = function(){
    return this.cached('latestMonthTransfered', function(){
        return Counter.find({})
            .sort({
                timestamp: -1
            })
            .limit(24 * 31)
            .lean()
            .exec()
            .then(function(counters){
                var transfered = 0;

                _.each(counters, function(counter){
                    transfered += (parseInt(counter.count) || 0) * JSONSize;
                });

                return {
                    transfered: transfered
                };
            });
    });
}

CounterDAL.prototype.getTodayTransfered = function(){
    return this.cached('todayTransfered', function(){
        return Counter.find({})
            .sort({
                timestamp: -1
            })
            .limit(24)
            .lean()
            .exec()
            .then(function(counters){
                var transfered = 0;

                _.each(counters, function(counter){
                    transfered += (parseInt(counter.count) || 0) * JSONSize;
                });

                return {
                    transfered: transfered
                };
            });
    });
}

CounterDAL.prototype.getTransfered = function(){
    return this.cached('overallTransfered', function(){
        return Counter.find({})
            .sort({
                timestamp: -1
            })
            .lean()
            .exec()
            .then(function(counters){
                var transfered = 0;

                _.each(counters, function(counter){
                    transfered += (parseInt(counter.count) || 0) * JSONSize;
                });

                return {
                    transfered: transfered
                };
            });
    });
}

module.exports = new CounterDAL();
