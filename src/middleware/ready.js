var RegistryDAL = require('../DAL/registry'),
    OnlineDAL;

function isReady(req, res, next){
    if (!OnlineDAL){
        OnlineDAL = require('../DAL/online');
    }

    if (RegistryDAL.registry && OnlineDAL.registry){
        next();
    } else {
        //TODO: change this message with cute placeholder
        res.status(500).send('Brackets Extensions server is starting up');
    }
}

module.exports = isReady;
