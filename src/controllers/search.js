var _ = require('lodash'),
    RegistryDAL = require('../DAL/registry'),
    Q = require('q'),
    Response = require('../response');

exports.default = function(req, res){
    var extensionId = req.params.id;

    if (!extensionId){
        return res.status(500).send();
    }

    RegistryDAL.getRegistry().then(function(registry){
        const extensions = _.chain(registry).filter(e => {
            const name = e.metadata.name || '';
            const title = e.metadata.title || '';
            const description = e.metadata.description || '';

            return name.indexOf(extensionId) !== -1 ||
                title.indexOf(extensionId) !== -1 ||
                description.indexOf(extensionId) !== -1;
        }).sortBy(e => -e.totalDownloads).value();

        res.render('search', new Response(req, {
            title: `${extensionId} extensions`,
            extensions: extensions,
            search: extensionId,
            notFound: _.size(extensions) === 0
        }));
    });
}
