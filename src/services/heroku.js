var request = require('request'),
    config = require('../config'),
    _ = require('lodash');

function HerokuUnsleep(){
    setTimeout(_.bind(this.handler, this), 5000);
}

HerokuUnsleep.prototype.handler = function(){
    request(config.herokuDeploy, (error, response, body) => {
        var timeout = 5000;

        if (!error){
            timeout = 60 * 1000 * 30;
        }

        setTimeout(() => this.handler(), timeout);
    });
}

module.exports = HerokuUnsleep;
