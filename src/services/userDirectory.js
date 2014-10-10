var _ = require('lodash'),
    timeout = 1000 * 60 * 5;

function UserDirectory(){
    this.storage = {};

    setTimeout(_.bind(this.clean, this), timeout);
}

UserDirectory.prototype.add = function(id, user){
    this.storage[id] = {
        timestamp: new Date().getTime(),
        user: user,
        token: id
    };
}

UserDirectory.prototype.clean = function(){
    var now = new Date().getTime(),
        self = this;

    _.each(this.storage, function(userInfo){
        if (now - userInfo.timestamp >= timeout){
            delete self.storage[userInfo.token];
        }
    });

    setTimeout(_.bind(this.clean, this), timeout);
}

UserDirectory.prototype.get = function(id){
    var user = this.storage[id] || null;

    return user;
}

UserDirectory.prototype.size = function(){
    return _.size(this.storage);
}

module.exports = new UserDirectory();
