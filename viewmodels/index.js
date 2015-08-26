function IndexPageViewModel(elementSelector){
    var element = $(elementSelector),
        websocket = require('./helpers/websocket'),
        onlineIndicator = require('./helpers/onlineIndicator');

    this.init(element);
    this.initSearch(element);
    this.hideZeroMaxUsers(element);

    websocket.connect();
    websocket.subscribe('*', function(message, data){
        console.log('Got %s message with %s bytes of data', message || 'unnamed', JSON.stringify(data).length);
    });

    websocket.subscribe('online', function(message, data){
        var widgetOnline = $('#onlineWidget'),
            $holder = widgetOnline.find('.holder'),
            $extensions = widgetOnline.find('.holder .extension');

        data.forEach(function(extension){
            var $extension = widgetOnline.find('.extension[data-ext="' + extension.name + '"]'),
                $extensionOnline = $extension.find('.onlineValue'),
                previousOnline = parseInt($extensionOnline.text()),
                currentOnline = parseInt(extension.online);

            $extension.attr('data-online', currentOnline);

            if (previousOnline !== currentOnline){
                $extensionOnline.text(extension.online);
                if (previousOnline < currentOnline){
                    $extensionOnline.addClass('up');
                    $extensionOnline.removeClass('down');
                } else {
                    $extensionOnline.addClass('down');
                    $extensionOnline.removeClass('up');
                }
            } else {
                $extensionOnline.removeClass('down');
                $extensionOnline.removeClass('up');
            }
        });

        $extensions.sort(function(first, second){
            var firstOnline = parseInt($(first).attr('data-online')),
                secondOnline = parseInt($(second).attr('data-online'));

            return firstOnline === secondOnline ? 0 :
                firstOnline > secondOnline? -1 : 1;
        });

        $holder.empty();
        $holder.append($extensions);
    });

    onlineIndicator.init();
}

IndexPageViewModel.prototype.init = function(element){
    this.initNumbers(element);
}

IndexPageViewModel.prototype.initNumbers = require('./helpers/formatNumbers');

IndexPageViewModel.prototype.initSearch = function(element){
    element.find('.search-input').on('keydown', function(event){
        var $target = $(event.target),
            extension;

        if (event.keyCode === 13){
            extension = $target.val();
            if (typeof extension === 'string' && extension.length > 0){
                location.href = location.origin + '/search/' + extension;
            }

            $target.val('');
        }
    });
}

IndexPageViewModel.prototype.hideZeroMaxUsers = function(element){
    element.find('.maxUsers').each(function(index, el){
        if (el.getAttribute('data-users') === '0'){
            el.style.visibility = 'hidden';
        }
    });
}

$(document).ready(function(){
    var viewmodel = new IndexPageViewModel('.main-content');
});
