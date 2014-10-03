var _ = require('lodash'),
    defaultConfig = {
        port: process.env.PORT || 3000,
        database: process.env.MONGO_URL,
        env: process.env.STAGING || 'dev'
}, config, localConfig;

try{
    localConfig = require('./local');
} catch(e){
    localConfig = {};
}

if (_.isEmpty(defaultConfig)){
    throw new Error('Default config cannot be empty');
}

config = _.extend(defaultConfig, localConfig);

module.exports = config;
