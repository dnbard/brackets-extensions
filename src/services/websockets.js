var wsClients = [],
    _ = require('lodash'),
    lastUpdated = null;

exports.init = function(wss){
    var OnlineDAL = require('../DAL/online');

    wss.on('connection', ws =>{
        console.log('Websocket client connected');

        wsClients.push(ws);

        ws.on('close', ()=>{
            _.remove(wsClients, ws);

            console.log('Websocket client disconnected');
        });

        ws.send(JSON.stringify({
            message: 'hello',
            data: {
                lastUpdate: lastUpdated,
                interval: 10000
            }
        }));
    });

    OnlineDAL.on('updated', registry => {
        lastUpdated = new Date();

        if (_.isEmpty(registry) || _.isEmpty(wsClients)){
            return;
        }

        var payload = JSON.stringify({
            data: _.map(registry, r => { return {
                name: r.name, online: r.online
            }}) || [],
            message: 'online'
        });

        _.each(wsClients, ws => ws.send(payload));
    });
}
