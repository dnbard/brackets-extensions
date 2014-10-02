var _ = require('lodash'),
    defaultConfig = {
        port: 3000,
        abc: 'lorem'
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

console.log(config);

module.export = config;
