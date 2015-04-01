exports.init = function(){
    var websocket = require('./websocket'),
        $indicator = $('#onlineWidget .progress-inner'),
        update, interval;

    setInterval(function(){
        if (!update){
            return;
        }

        var timeToUpdate = (update - new Date()),
            progress = ((interval - timeToUpdate) / 100) + '%';

        $indicator.css('width', progress);
    }, 25);

    websocket.subscribe('hello', function(message, data){
        update = new Date(data.lastUpdate);
        interval = data.interval;

        console.log('Last Update %s', update.toTimeString());

        update.setMilliseconds(interval + update.getMilliseconds());
        console.log('Next update in %s sec.', (update - new Date()) / 1000);
    });

    websocket.subscribe('online', function(){
        update = new Date();
        update.setMilliseconds(interval + update.getMilliseconds());
    });
}
