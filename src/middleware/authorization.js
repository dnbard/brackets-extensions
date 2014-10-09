var cookieName = 'X-Brackets-Token',
    uuid = require('node-uuid').v4,
    userDirectory = require('../services/userDirectory');

function authorization(req, res, next){
    var cookie = req.cookies[cookieName],
        token;

    if (!cookie){
        token = uuid();
        res.cookie(cookieName, token, { expires: new Date(Date.now() + 900000), httpOnly: true });
        cookie = token;
    }

    userDirectory.add(cookie, {});

    next();
}

module.exports = authorization;
