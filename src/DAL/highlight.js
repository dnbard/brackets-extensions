var BaseDAL = require('./base'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Highlights = mongoose.model('Highlight'),
    ExtensionDAL = require('./extension'),
    Q = require('q');

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
            }).then(function(extension){
                return {
                    extension: extension,
                    data: highlightedExtension
                }
            });
    });
}
HightlightDAL.prototype.getAll = function(){
    var highlightedExtensions;

    return Highlights.find({})
        .sort({ timestamp: -1 })
        .lean()
        .exec()
        .then(function(data){
            var getExtensionPromises;
            highlightedExtensions = data;

            getExtensionPromises = _.map(highlightedExtensions, function(highlightedExtension){
                return ExtensionDAL.getExtension(highlightedExtension._id);
            });

            return Q.all(getExtensionPromises);
        }).then(function(extensions){
            return _.map(extensions, function(extension, index){
                return {
                    extension: extension,
                    data: highlightedExtensions[index]
                }
            });
        });
}

module.exports = new HightlightDAL();
