var winston = require('winston'),
    _ = require('lodash'),
    ExtensionDAL = require('../DAL/extension'),
    Q = require('q');

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

        res.render('author',{
            title: authorId.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim() + ' extensions',
            author: authorId.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, '').replace(',', '').trim(),
            extensions: extensions,
            user: req.user
        });
    }, function(){
        res.render('not-found',{
            title: 'Author not found',
            type: 'Author',
            id: authorId,
            user: req.user
        });
    });
}

module.exports = new AuthorController();
