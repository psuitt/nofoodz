Template.wsie.destroyed = function() {

};

Template.wsie.rendered = function() {

    $('#wsie_random').on('click', doRandom);

};

Template.wsie.events({

});

var doRandom = function () {

    $('#wsie_random').off('click').removeClass('glyphicon glyphicon-gift').addClass('loading');

    Meteor.call('getRandom', {type: NoFoodz.consts.FOOD}, function (err, response) {

        if (!err) {
            if (response.rating) {
                $('#wsie_resultbrand').shuffleLetters({
                    step: 25,
                    text: response.item.brand_view,
                    callback: startItem(response.item.name)
                });

            } else {
                $('#wsie_result').text('Please rate more things to use this feature');
            }
        }

    });

};

var startItem = function (name) {
    var func = function () {
        $('#wsie_result').shuffleLetters({step: 25, text: name, callback: addListener});
    };
    return func;
};

var addListener = function () {
    $('#wsie_random').on('click', doRandom).removeClass('loading').addClass('glyphicon glyphicon-gift');
};
