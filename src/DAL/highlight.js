var BaseDAL = require('./base'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Highlights = mongoose.model('Highlight'),
    ExtensionDAL = require('./extension');

function HightlightDAL(){
}

HightlightDAL.prototype = new BaseDAL();

HightlightDAL.prototype.getCurrent = function(){
    return this.cached('extensionsHighlighted', function(){
        var highlightedExtension;

        return Highlights.find({})
            .sort({ timestamp: -1 })
            .limit(1)
            .lean()
            .exec()
            .then(function(data){
                highlightedExtension = _.first(data);
                return ExtensionDAL.getExtension(highlightedExtension._id);
            })
            .then(function(extension){
                return {
                    extension: extension,
                    data: highlightedExtension
                }
            });
    });
}

module.exports = new HightlightDAL();
