var path = require('path'),
    fs = require('fs');

function BootstrapModels(){
    var modelsPath = path.join(__dirname, 'models');
    fs.readdirSync(modelsPath).forEach(file => {
        if (/(.*)\.(js$|coffee$)/.test(file)) {
            require(modelsPath + '/' + file);
        }
    });
}

module.exports = BootstrapModels;
