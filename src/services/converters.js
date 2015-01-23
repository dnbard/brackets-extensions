var _ = require('lodash');

function dailyUsers(application){
    if (typeof application !== 'object'){
        return [];
    }

    var dailyUsersStringified = application.dailyUsers || '';
    var dailyUsers = _.compact(dailyUsersStringified.split(',')) || [];

    return dailyUsers;
}

module.exports = {
    dailyUsers: dailyUsers
};
