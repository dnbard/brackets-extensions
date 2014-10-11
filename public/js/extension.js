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

ExtensionPageViewModel.prototype.prependAll = function(matches, prepend){
    return _.map(matches, function(match){
        return prepend + match;
    });
}

ExtensionPageViewModel.prototype.replaceAll = function(content, before, after){
    if (!_.isArray(before) || !_.isArray(after) || before.length !== after.length){
        throw new Error('Invalid argument');
    }

    for(var i = 0, max = before.length; i < max; i ++){
        content = content.replace(before[i], after[i]);
    }

    return content;
}

ExtensionPageViewModel.prototype.getAllMatches = function(content, reg){
    var matches = [],
        found;

    while (found = reg.exec(content)){
        matches.push(found[1]);
    }

    return matches;
}

ExtensionPageViewModel.prototype.formatMarkdown = function(content, element){
    var markdown = Markdown.toHTML(content),
        repository = element.find('input#repository').val(),
        before, after;

    //src="screenshots/main.jpg"
    before = this.getAllMatches(markdown, /src="(.*?)"/g);
    _.remove(before, function(url){
        return url.indexOf('http') !== -1;
    });
    after = this.prependAll(before, repository + '/raw/master/');
    markdown = this.replaceAll(markdown, before, after);

    //https://github.com/zaggino/brackets-git/raw/master/

    return markdown;
}

ExtensionPageViewModel.prototype.initReadme = function(element){
    var self = this;

    function makeAjax(url){
        $.ajax(url).success(function(data){
            var content = atob(data.content),
                markdown = self.formatMarkdown(content, element);

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
            readmePathBase = readmePathBase.substring(0, readmePathBase.length - 1);
        }

        makeAjax(readmePathBase + readmePathEndings[endingIndex]);
    } else {
        console.log('Can\'t get readme file for this extension');
    }
}

$(document).ready(function(){
    var viewmodel = new ExtensionPageViewModel('.extension-single');
});
