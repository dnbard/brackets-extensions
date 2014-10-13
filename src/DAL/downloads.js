var mongoose = require('mongoose'),
    Downloads = mongoose.model('Download'),
    BaseDAL = require('./base'),
    _ = require('lodash');

function DownloadsDAL(){}

DownloadsDAL.prototype = new BaseDAL();

DownloadsDAL.prototype.getDownloads = function(extensionId){
    return Downloads.find({extension: extensionId}).lean().exec();
}

module.exports = new DownloadsDAL();
