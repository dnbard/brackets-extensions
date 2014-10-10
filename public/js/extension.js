$(document).ready(function(){
    $('.date').text(function(index, value){
        var date = moment(value).fromNow();

        return date;
    });
});
