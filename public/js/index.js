function IndexPageViewModel(elementSelector){
    var element = $(elementSelector);
    this.init(element);
    this.initSearch(element);
}

IndexPageViewModel.prototype.init = function(element){
    this.initNumbers(element);
}

IndexPageViewModel.prototype.initNumbers = function(element){
    element.find('.number').text(function(index, initial){
        var result = initial;

        if (initial > 1000){
            result = Math.floor(parseInt(initial) / 1000) + 'k';
        } else if (initial < 1000){
            result = Math.floor(initial / 10) * 10;
        }

        return result;
    });
}

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

$(document).ready(function(){
    var viewmodel = new IndexPageViewModel('.main-content');
});
