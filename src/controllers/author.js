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
            title: 0 + ' extensions',
            author: 0,
            extensions: extensions
        });
    });
}

module.exports = new AuthorController();
