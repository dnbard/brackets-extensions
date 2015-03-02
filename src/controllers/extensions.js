var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    Q = require('q'),
    Response = require('../response');

function ExtensionsController(){}

ExtensionsController.prototype.default = function(req, res){
    ExtensionDAL.getMostDownloadsExtensionList().then(function(extensions){
        //var extensions = results[0];

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

}

module.exports = new ExtensionsController();
