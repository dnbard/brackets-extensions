var _ = require('lodash'),
    DownloadsDAL = require('../DAL/downloads'),
    Q = require('q');

exports.default = function(req, res, next){
    var extensionId = req.params.id;

    if (!extensionId){
        res.status(500).send();
        return;
    }

    Q.all([
        DownloadsDAL.getDownloads(extensionId)
    ]).then(result => {
        var downloads = result[0];

        res.send({
            extension: extensionId,
            downloads: downloads
        });
    }, err => {
        res.status(500).send(err);
    });
}
