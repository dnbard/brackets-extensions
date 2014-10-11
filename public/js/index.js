function IndexPageViewModel(elementSelector){
    var element = $(elementSelector);
    this.init(element);
}

IndexPageViewModel.prototype.init = function(element){
    this.initNumbers(element);
}

IndexPageViewModel.prototype.initNumbers = function(element){
    element.find('.number').text(function(index, initial){
        var result = initial;

        if (initial > 1000){
            result = Math.ceil(parseInt(initial) / 1000) + 'k';
        }

        return result;
    });
}

$(document).ready(function(){
    var viewmodel = new IndexPageViewModel('.main-content');
});
