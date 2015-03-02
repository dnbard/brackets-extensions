/*
http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
by Patrick Desjardins
*/
function formatNumber(n, c, d, t){
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

module.exports = function(element, applyAdditionalFormat){
    applyAdditionalFormat = !!applyAdditionalFormat;

    element.find('.number').text(function(index, initial){
        var result;

        if (applyAdditionalFormat){
            result = formatNumber((Math.floor(initial / 10) * 10) || 0, 0, '.', ' ');
        } else {
            if (initial > 1000){
                result = Math.floor(parseInt(initial) / 1000) + 'k';
            } else if (initial < 1000){
                result = Math.floor(initial / 10) * 10;
            }
        }

        return result;
    });
}
