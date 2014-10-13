var _ = require('lodash'),
    DownloadsDAL = require('../DAL/downloads'),
    Q = require('q');

function DownloadsController(){}

DownloadsController.prototype.default = function(req, res, next){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        DownloadsDAL.getDownloads(extensionId)
    ]).then(function(result){
        var downloads = result[0];

        res.send({
            extension: extensionId,
            downloads: downloads
        });
    }, function(err){
        res.status(500).send(err);
    });
}

module.exports = new DownloadsController();
