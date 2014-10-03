var mongoose = require('mongoose'),
    Extension = mongoose.model('Extension'),
    baseDAL = require('./base');

function ExtensionDAL(){}

ExtensionDAL.prototype = baseDAL;

ExtensionDAL.prototype.getExtensionsCount = function(){
    return this.cached('extensionsCount', function(){
        return Extension.find({}).count().exec();
    });
}

module.exports = new ExtensionDAL();
