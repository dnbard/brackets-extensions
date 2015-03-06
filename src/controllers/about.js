var Response = require('../response'),
    CounterDAL = require('../DAL/counter'),
    Q = require('q'),
    package = require('../../package.json');

exports.default = function(req, res){
    Q.all([
        CounterDAL.getLatestMonthTransfered()
    ]).then(function(results){
        console.log(results);

        var transfered = results[0].transfered,
            version = package.version;

        res.render('about', new Response(req, {
            title: 'Extensions Rating',
            transfered: transfered,
            transferedFormatted: (transfered / 1000000000).toFixed(1),
            transferedType: 'GB',
            version: version
        }));
    });
}
