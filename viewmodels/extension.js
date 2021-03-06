function ExtensionPageViewModel(elementSelector){
    var element = $(elementSelector);

    this.init(element);
}

ExtensionPageViewModel.prototype.init = function(element){
    this.initDates(element);
    this.initReadme(element);
    this.initNumbers(element, true);
    this.initVersions(element);
    this.initBars(element);
    this.initDailyUsers(element);

    this.getDownloads(element);
}

ExtensionPageViewModel.prototype.initDailyUsers = function(element){
    function getData(){
        return $('#dailyUsers').val();
    }

    var dailyUsersdata = getData(),
        dates = [];

    if (dailyUsersdata){
        var data = dailyUsersdata.split(','),
            graph = new Rickshaw.Graph({
                element: document.querySelector("#chart-users"),
                renderer: 'bar',
                series: [{
                        data: _.map(data, function(usersCount, index){
                            if (index === data.length - 1){
                                dates[index] = 'Now';
                            } else if (index === data.length - 2){
                                dates[index] = '1 hour ago';
                            } else {
                                dates[index] = (data.length - index - 1) + ' hours ago';
                            }
                            return { x: index, y: +usersCount }
                        }),
                        color: '#a8bacf',
                        name: 'Users online'
                }]
            });

        graph.render();

        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) { return dates[x]; },
            yFormatter: function(y) { return y; }
        });
    } else {
        element.find('.dailyUsers').hide();
    }
}

ExtensionPageViewModel.prototype.getDownloads = function(element){
    var endpointUrl = 'http://' + location.host + location.pathname + '/downloads';

    $.ajax(endpointUrl).success(function(extension){
        var previous = null,
            current = null,
            download, i, max;

        extension.downloads = _.sortBy(extension.downloads, 'timestamp');
        extension.sorted = [];

        for(i = extension.downloads.length - 1; i>=0; i--){
            download = extension.downloads[i];
            current = new Date(download.timestamp).getDate();

            if (!previous || previous !== current){
                extension.sorted.push(download);
            }

            previous = current;
        }

        for(i = 0, max = extension.sorted.length; i < max; i ++){
            if (extension.sorted[i+1]){
                extension.sorted[i].inc = extension.sorted[i].count - extension.sorted[i+1].count;
            } else {
                extension.sorted[i].inc = 0;
            }
        }

        var data = _.first(extension.sorted, 30).reverse(),
            dates = [];

        var graph = new Rickshaw.Graph({
                element: document.querySelector("#chart"),
                renderer: 'bar',
                series: [{
                        data: _.map(data, function(download, index){
                            dates.push(download.timestamp);
                            return { x: index, y: download.inc }
                        }),
                        color: '#a8bacf',
                        name: 'Downloads'
                }]
        });

        graph.render();

        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) { return new Date(dates[x]).toLocaleDateString(); },
            yFormatter: function(y) { return y; }
        });
    });
}

ExtensionPageViewModel.prototype.initBars = function(element){
    var bars = element.find('.bar');

    if (bars.length === 0){
        return;
    }

    var totalDownloads = $(_.max(bars, function(bar){
        var $bar = $(bar);
        return parseInt($bar.attr('current'));
    })).attr('current');

    _.each(bars, function(bar){
        var $bar = $(bar),
            currentDownloads = $bar.attr('current'),
            proportion = parseInt(currentDownloads / totalDownloads * 100) || 1,
            barInner = $('<div class="bar-inner"></div>');

        $bar.append(barInner);
        barInner.css('width', proportion + '%');
    });
}

ExtensionPageViewModel.prototype.initVersions = function(element){
    var counter = 0,
        roundPoint = 2,
        elements = element.find('.version'),
        numberOfElements = elements.length || 0;

    elements.each(function(index, version){
        var $version = $(version);

        if (counter === roundPoint && counter !== numberOfElements - 1){
            $version.after('<a class="showMoreVersions">Show more versions</a>');
            element.find('.showMoreVersions').on('click', function(event){
                $(event.target).remove();
                element.find('.version').show();
            });
        } else if (counter > roundPoint) {
            $version.hide();
        }

        counter ++;
    });
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

    return markdown;
}

ExtensionPageViewModel.prototype.initNumbers = require('./helpers/formatNumbers');

ExtensionPageViewModel.prototype.initReadme = function(element){
    var content = element.find('.readme .content').text() || '';

    if (content.length < 10){
        return;
    }

    var markdown = this.formatMarkdown(content, element);
    element.find('.readme .content').html(markdown);
    setTimeout(function(){
        element.find('.readme').show();
    }, 100);
}

$(document).ready(function(){
    var viewmodel = new ExtensionPageViewModel('.extension-single');
});
