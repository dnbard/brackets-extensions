var cachedData = null,
    ExtensionDAL = require('../DAL/extension'),
    DownloadsDAL = require('../DAL/downloads'),
    _ = require('lodash');

function calculate(){
    var stream = ExtensionDAL.getAllExtensionIds(),
        counter = 0,
        timestamp = new Date(),
        extensions = [],
        processedExtensions = [];

    stream.on('data', function(extension){
        counter ++;
        extensions.push(extension.id);
    });

    stream.on('close', function(){
        var ext = extensions.shift();

        function processExtension(ext){
            DownloadsDAL.getDataFor24Hours(ext).then(function(extData){
                if (Array.isArray(extData) && extData.length > 1 ){
                    ExtensionDAL.setDailyDownloadCounter(ext,
                        extData[0].count === extData[extData.length-1].count ? 0 :
                        extData[0].count - extData[extData.length-1].count);
                }

                ext = extensions.shift();

                if (ext){
                    processExtension(ext);
                } else {
                    console.log('Took %s s', (new Date() - timestamp) / 1000);
                    setTimeout(calculate, 60 * 1000 * 24);
                }
            }, function(err){
                console.log(err);
            });
        }

        console.log('Got %s extensions', extensions.length);

        processExtension(ext);
    });
}

exports.calculate = calculate;
