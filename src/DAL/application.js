var mongoose = require('mongoose'),
    BaseDAL = require('./base'),
    userDirectory = require('../services/userDirectory'),
    Q = require('q'),
    _ = require('lodash');

function ApplicationDAL(){}

ApplicationDAL.prototype = new BaseDAL();

ApplicationDAL.prototype.usersCount = function(){
    return this.cached({
        key:'usersCount',
        handler: function(){
            var defer = Q.defer();

            defer.resolve(userDirectory.size());

            return defer.promise;
        },
        invalidate: 1000 * 60 * 5
    });
}

module.exports = new ApplicationDAL();
