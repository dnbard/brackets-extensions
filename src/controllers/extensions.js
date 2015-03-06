var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    HightlightDAL = require('../DAL/highlight'),
    Q = require('q'),
    Response = require('../response');

exports.default = function(req, res){
    ExtensionDAL.getMostDownloadsExtensionList().then(extensions => {
        res.render('search', new Response(req, {
            title: 'TOP-100 extensions',
            extensions: extensions,
            notFound: _.size(extensions) === 0,
            search: 'TOP-100',
            user: null
        }));
    }, () => {
        res.render('not-found', new Response(req, {
            title: 'Page not found',
            type: 'Page'
        }));
    });
}

exports.featured = function(req, res){
    HightlightDAL.getAll().then(extensions => {
        res.render('featured', new Response(req, {
            title: 'Featured Extensions',
            extensions: extensions,
            user: null
        }));
    }, () => {
        res.render('not-found', new Response(req, {
            title: 'Page not found',
            type: 'Page'
        }));
    });
}
