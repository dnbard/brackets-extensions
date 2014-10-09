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

    console.log('User directory updated. Storage size %s', _.size(this.storage));
}

UserDirectory.prototype.clean = function(){
    var now = new Date().getTime(),
        self = this;

    console.log('Clean procedure started. Storage size %s', _.size(this.storage));

    _.each(this.storage, function(userInfo){
        if (now - userInfo.timestamp >= timeout){
            delete self.storage[userInfo.token];
        }
    });

    console.log('Clean procedure finished. Storage size %s', _.size(this.storage));

    setTimeout(_.bind(this.clean, this), timeout);
}

module.exports = new UserDirectory();
