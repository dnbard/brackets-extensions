var request = require('request'),
    mongoose = require('mongoose'),
    config = require('../config'),
    User;

exports.github = function(req, res){
    var code = req.query.code,
        token;

    if (!User){
        User = mongoose.model('User');
    }

    if (typeof code !== 'string' || code.length === 0){
        return status500Response();
    }

    function processGithubResponse(error, response, body){
        if (error){
            return status500Response(error);
        }

        token = body.access_token;

        request.get({
            url: 'https://api.github.com/user',
            headers: getGithubHeaders(token),
            json: true
        }, processGithubGetUserInfo);
    }

    function getGithubHeaders(token){
        return {
            'Authorization': 'token ' + token,
            'User-Agent': config.githubAppName
        };
    }

    function processGithubGetUserInfo(error, response, body){
        if (error){
            return status500Response(error);
        }

        var githubUser = body;

        User.findOne({email: githubUser.email}).exec(function(err, user){
            if (err){
                return status500Response(err);
            }

            if (user === null){
                user = new User({
                    login: githubUser.login,
                    token: req.token,
                    role: 'user',
                    email: githubUser.email,
                    avatar_url: githubUser.avatar_url,
                    name: githubUser.name
                });
            } else {
                user.login = githubUser.login;
                user.token = req.token;
                user.email = githubUser.email;
                user.avatar_url = githubUser.avatar_url;
                user.name = githubUser.name;
            }

            user.save(function(err){
                if (err){
                    return status500Response(err);
                }

                res.redirect('/');
            });
        });
    }

    function status500Response(err){
        err = err || 'No error provided';
        res.status(500).send(err);
    }

    request.post({
        url: 'https://github.com/login/oauth/access_token',
        body: {
            client_id: config.githubClientId,
            client_secret: config.githubClientSecret,
            code: code
        },
        json: true
    }, processGithubResponse);
};
