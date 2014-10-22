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

        console.log(_.first(extensions));

        res.render('author',{
            title: authorId + ' extensions',
            author: authorId,
            extensions: extensions
        });
    });
}

module.exports = new AuthorController();
