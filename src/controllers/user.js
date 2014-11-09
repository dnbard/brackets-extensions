var _ = require('lodash'),
    Q = require('q'),
    Response = require('../response');

function UserController(){}

UserController.prototype.default = function(req, res, next){
    if (!req.user){
        return res.redirect('/');
    }

    res.render('user', new Response(req, {
        title: 'Dashboard'
    }));
}

module.exports = new UserController();
