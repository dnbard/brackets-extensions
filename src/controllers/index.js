var winston = require('winston'),
    _ = require('lodash'),
    RegistryDAL = require('../DAL/registry'),
    Response = require('../response');

exports.default = function(req, res, next){
    res.render('index', new Response(req, { title: 'Home' }));
}
