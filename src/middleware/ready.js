var RegistryDAL = require('../DAL/registry');

function isReady(req, res, next){
    if (RegistryDAL.registry){
        next();
    } else {
        //TODO: change this message with cute placeholder
        res.status(500).send('Brackets Extensions server is starting up');
    }
}

module.exports = isReady;
