var mongoose = require('mongoose'),
    Downloads = mongoose.model('Download'),
    BaseDAL = require('./base'),
    _ = require('lodash');

function DownloadsDAL(){}

DownloadsDAL.prototype = new BaseDAL();

DownloadsDAL.prototype.getDownloads = function(extensionId){
    return Downloads.find({extension: extensionId})
        .select({_id: 0, timestamp: 1, count: 1})
        .lean()
        .exec();
}

module.exports = new DownloadsDAL();
