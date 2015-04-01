var websocketPath = 'ws://' + window.location.host,
    subscribers = [];

exports.connect = function(){
    var connection = new WebSocket(websocketPath);

    connection.onopen = function () {
        console.log('WebSocket connected to %s', websocketPath);
    };

    connection.onerror = function (error) {
        console.log('WebSocket Error: %s', error);
    };

    connection.onclose = function(error){
        console.log('WebSocket Closed: %s', error);
        setTimeout(exports.connect, 1000);
    }

    connection.onmessage = function (e) {
        var payload = JSON.parse(e.data),
            data = payload.data || payload,
            message = payload.message || '';

        subscribers.filter(function(sub){
            return sub.message === '*' || sub.message === message;
        }).forEach(function(sub){
            sub.handler(message, data);
        });
    };
}

exports.subscribe = function(message, handler){
    subscribers.push({
        message: message,
        handler: handler
    });
}
