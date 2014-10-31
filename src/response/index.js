var config = require('../config'),
    _ = require('lodash');

function BaseResponse(req, obj){
    this.githubClient = config.githubClientId;
    this.githubOAuthPath = 'https://github.com/login/oauth/authorize';
    this.user = req.user;

    _.extend(this, obj);
}

module.exports = BaseResponse;
