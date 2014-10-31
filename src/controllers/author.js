var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    Q = require('q'),
    Response = require('../response');

function AuthorController(){}

AuthorController.prototype.default = function(req, res){
    var authorId = req.params.id;

    if (!authorId){
        res.status(500).send();
        return;
    }

    Q.all([
        ExtensionDAL.getExtensionsByAuthor(authorId)
    ]).then(function(results){
        var extensions = results[0];

        res.render('author', new Response(req, {
            title: authorId.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim() + ' extensions',
            author: authorId.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim(),
            extensions: extensions
        }));
    }, function(){
        res.render('not-found', new Response(req, {
            title: 'Author not found',
            type: 'Author',
            id: authorId
        }));
    });
}

module.exports = new AuthorController();
