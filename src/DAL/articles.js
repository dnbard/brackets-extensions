var mongoose = require('mongoose'),
    BaseDAL = require('./base'),
    Q = require('q'),
    _ = require('lodash'),
    Articles = mongoose.model('Articles');

function ArticlesDAL(){

}

ArticlesDAL.prototype = new BaseDAL();

ArticlesDAL.prototype.getArticle = function(alias){
    return Articles.findOne({ alias: alias }).exec();
}

ArticlesDAL.prototype.getArticles = function(alias){
    return Articles.find({
        published: true
    }).sort({
        createdAt: -1
    }).exec();
}

module.exports = new ArticlesDAL();
