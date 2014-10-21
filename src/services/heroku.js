var request = require('request'),
    config = require('../config'),
    _ = require('lodash');

function HerokuUnsleep(){
    setTimeout(_.bind(this.handler, this), 5000);
}

HerokuUnsleep.prototype.handler = function(){
    var self = this;

    request(config.herokuDeploy, function (error, response, body){
        var timeout = 5000;

        if (!error){
            timeout = 60 * 1000 * 30;
        }

        setTimeout(_.bind(self.handler, self), timeout);
    });
}

module.exports = HerokuUnsleep;
