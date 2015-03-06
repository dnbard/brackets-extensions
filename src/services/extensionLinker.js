var events = require('./events'),
    request = require('request'),
    config = require('../config'),
    RegistryDAL = require('../DAL/registry'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    User;

function getGithubHeaders(token){
    return {
        'Authorization': 'token ' + token,
        'User-Agent': config.githubAppName
    };
}

events.on(events.list.USER.NEW, function(user){
    var token = user.githubToken;

    request.get({
        url: 'https://api.github.com/user/repos',
        headers: getGithubHeaders(token),
        json: true
    }, (error, response, body) => {
        var extensions = _(body).map(extension => {
            if (extension.fork){
                return null;
            }

            return {
                id: extension.id,
                name: extension.name,
                url: extension.html_url,
                repo_url: extension.clone_url,
                owner: 'github:' + (extension.owner.login || 'NULL')
            };
        }).compact().value();

        RegistryDAL.getRegistry().then(registry => {
            var owner = _.find(extensions, ext => ext.owner.indexOf('NULL') === -1).owner,
                result = _.chain(registry).filter(ext => ext.owner === owner)
                    .map(ext => ext.metadata.name)
                    .value();

            if (!User){
                User = mongoose.model('User');
            }

            User.findOneAndUpdate({email: user.email}, {extensions: result}).exec();
        });
    });
});
