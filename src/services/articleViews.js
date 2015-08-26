var storage = new Map();
var mongoose = require('mongoose');
var Articles = mongoose.model('Articles');

exports.add = function(id){
    if (storage.has(id)){
        storage.set(id, storage.get(id) + 1);
    } else {
        storage.set(id, 1);
    }
}

setInterval(() => {
    storage.forEach((views, id) => {
        if (!views){
            return true;
        }

        Articles.findOne({ _id: id }).exec().then(function(article){
            if (!article){
                return console.log('Cannot find article(id:' + article._id + ')');
            }

            article.views += storage.get(id);
            storage.set(id, 0);

            article.save((err) => {
                if (err){
                    return console.log('Cannot save article(id:' + article._id + ') changes');
                }

                console.log('Article(id:' + article._id + ') changes saved');
            });
        });
    });
}, 1000 * 60 * 5);
