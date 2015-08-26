var Response = require('../response'),
    ArticlesDAL = require('../DAL/articles');

exports.default = function(req, res, next){
    var alias = req.params.alias;

    if (typeof alias !== 'string' || alias.length === 0){
        return res.render('not-found', new Response(req, {
            title: 'Article not found',
            type: 'Article',
            id: alias
        }));
    }

    ArticlesDAL.getArticle(alias).then((article) => {
        if (!article){
            return res.render('not-found', new Response(req, {
                title: 'Article not found',
                type: 'Article',
                id: alias
            }));
        }

        res.render(article.layout, new Response(req, article));
    }, function(){
        res.render('not-found', new Response(req, {
            title: 'Article not found',
            type: 'Article',
            id: alias
        }));
    });
}