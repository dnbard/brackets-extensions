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

        //ArticleViews.add(article.id);

        res.render(article.layout, new Response(req, article.toObject()));
    }, function(){
        res.render('not-found', new Response(req, {
            title: 'Article not found',
            type: 'Article',
            id: alias
        }));
    });
}

exports.all = function(req, res){
    ArticlesDAL.getArticles().then(articles => {
        res.render('blog', new Response(req, {
            title: 'Blog',
            articles: articles
        }));
    }, () => {
        res.render('not-found', new Response(req, {
            title: 'Articles not found',
            type: 'Articles',
            id: undefined
        }));
    });
}
