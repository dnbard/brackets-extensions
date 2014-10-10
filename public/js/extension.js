function ExtensionPageViewModel(elementSelector){
    var element = $(elementSelector);

    this.init(element);
}

ExtensionPageViewModel.prototype.init = function(element){
    this.initDates(element);
    this.initReadme(element);
}

ExtensionPageViewModel.prototype.initDates = function(element){
    element.find('.date').text(function(index, value){
        var date = moment(value).fromNow();

        return date;
    });
}

ExtensionPageViewModel.prototype.initReadme = function(element){
    function makeAjax(url){
        $.ajax(url).success(function(data){
            var content = atob(data.content),
                markdown = Markdown.toHTML(content);

            element.find('.readme .content').html(markdown);

            setTimeout(function(){
                element.find('.readme').show();
            }, 100);
        }).error(function(){
            var ending;

            endingIndex ++;
            ending = readmePathEndings[endingIndex];

            if (ending){
                makeAjax(readmePathBase + ending);
            } else {
                console.log('Can\'t get readme file for this extension');
            }
        });
    }

    var repository = element.find('input#repository').val(),
        readmePathBase,
        readmePathEndings = ['/contents/README.md', '/contents/Readme.md', '/contents/readme.md'],
        endingIndex = 0;

    if (repository.indexOf('https://github.com/') !== -1){
        readmePathBase = repository.replace('https://github.com/', 'https://api.github.com/repos/');

        if (readmePathBase[readmePathBase.length - 1] === '/'){
            readmePathBase = readmePathBase.substring(0, str.length - 1);
        }

        makeAjax(readmePathBase + readmePathEndings[endingIndex]);
    } else {
        console.log('Can\'t get readme file for this extension');
    }
}

$(document).ready(function(){
    var viewmodel = new ExtensionPageViewModel('.extension-single');
});

//https://raw.githubusercontent.com/ github/markup /master/README.md
//https://github.com/                github/markup
//https://api.github.com/repos/      :owner/:repo  /contents/readme.md
