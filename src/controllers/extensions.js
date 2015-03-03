var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    HightlightDAL = require('../DAL/highlight'),
    Q = require('q'),
    Response = require('../response');

function ExtensionsController(){}

ExtensionsController.prototype.default = function(req, res){
    ExtensionDAL.getMostDownloadsExtensionList().then(function(extensions){
        res.render('search', new Response(req, {
            title: 'TOP-100 extensions',
            extensions: extensions,
            notFound: _.size(extensions) === 0,
            search: 'TOP-100',
            user: null
        }));
    }, function(){
        res.render('not-found', new Response(req, {
            title: 'Page not found',
            type: 'Page'
        }));
    });
}

ExtensionsController.prototype.featured = function(req, res){
    HightlightDAL.getAll().then(function(extensions){
        res.render('featured', new Response(req, {
            title: 'Featured Extensions',
            extensions: extensions,
            user: null
        }));
    }, function(){
        res.render('not-found', new Response(req, {
            title: 'Page not found',
            type: 'Page'
        }));
    })
}

module.exports = new ExtensionsController();
