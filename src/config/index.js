var _ = require('lodash'),
    defaultConfig = {
        port: process.env.PORT || 3000,
        database: process.env.MONGO_URL,
        env: process.env.STAGING || 'dev',
        registryPath: 'http://s3.amazonaws.com/extend.brackets/registry.json',
        herokuDeploy: 'http://brackets-extensions.herokuapp.com',
        githubAppName: 'Brackets Extensions',
        githubClientId: '20424fe39882a6b99f90',
        githubClientSecret: process.env.GH_SECRET
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
