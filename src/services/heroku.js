var request = require('request'),
    config = require('../config');

function HerokuUnsleep(){
}

HerokuUnsleep.prototype.handler = function(){
    request(config.herokuDeploy, function (error, response, body){
        if (error){

        } else {

        }
    });
}

module.exports = HerokuUnsleep;
