var Response = require('../response'),
    // CounterDAL = require('../DAL/counter'),
    Q = require('q'),
    packageJSON = require('../../package.json');

exports.default = function(req, res){
    const version = packageJSON.version;

    res.render('about', new Response(req, {
        title: 'Extensions Rating',
        transfered: 0,
        transferedFormatted: 0,
        transferedType: 'GB',
        version: version
    }));
}
