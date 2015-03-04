var Response = require('../response'),
    CounterDAL = require('../DAL/counter');

exports.default = function(req, res){
    CounterDAL.getLatestMonthTransfered().then(function(result){
        res.render('about', new Response(req, {
            title: 'Extensions Rating',
            transfered: result.transfered,
            transferedFormatted: (result.transfered / 1000000000).toFixed(1),
            transferedType: 'GB'
        }));
    });
}
