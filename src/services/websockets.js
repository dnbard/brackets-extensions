var wsClients = [],
    _ = require('lodash');

exports.init = function(wss){
    var OnlineDAL = require('../DAL/online');

    wss.on('connection', ws =>{
        console.log('Websocket client connected');

        wsClients.push(ws);

        ws.on('close', ()=>{
            _.remove(wsClients, ws);

            console.log('Websocket client disconnected');
        });
    });

    OnlineDAL.on('updated', registry => {
        if (_.isEmpty(registry) || _.isEmpty(wsClients)){
            return;
        }

        var data = JSON.stringify(_.map(registry, r => { return {
            name: r.name, online: r.online
        }}) || []);

        console.log('Websocket data: %s bytes', data.length);

        _.each(wsClients, ws => ws.send(data));
    });
}
