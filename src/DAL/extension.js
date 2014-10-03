var mongoose = require('mongoose'),
    Extension = mongoose.model('Extension');

function ExtensionDAL(){}

ExtensionDAL.prototype.getExtensionsCount = function(){
    return Extension.find({}).count().exec();
}

module.exports = new ExtensionDAL();
