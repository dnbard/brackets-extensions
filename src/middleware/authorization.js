var cookieName = 'X-Brackets-Token',
    uuid = require('node-uuid').v4,
    userDirectory = require('../services/userDirectory'),
    mongoose = require('mongoose'),
    User;

function authorization(req, res, next){
    var cookie = req.cookies[cookieName],
        token,
        user = null,
        userEntity,
        twoDaysTimeout = 172800000;

    if (!User){
        User = mongoose.model('User');
    }

    if (!cookie){
        token = uuid();
        res.cookie(cookieName, token, { expires: new Date(Date.now() + twoDaysTimeout), httpOnly: true });
        cookie = token;

        userDirectory.add(cookie, null);
        req.user = null;
        req.token = token;
        next();
    } else {
        userEntity = userDirectory.get(cookie);
        if (!userEntity || !userEntity.user){
            User.findOne({ token: cookie }).lean().exec().then(function(user){
                userDirectory.add(cookie, user);
                req.user = user;
                req.token = cookie;
                next();
            });
        } else {
            req.user = userEntity.user;
            req.token = cookie;
            next();
        }
    }
}

module.exports = authorization;
