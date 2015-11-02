var nofoodsRating,
    idField,
    updateMethod;

Template.foods.destroyed = function () {
};

var done = function (err, data) {

    if (err || !data || !data.item) {
        Router.go('/404');
    }

    var item = data.item;

    reloadRating(item);

    $('.food-name').html(item.name);
    $('.brand').html(NoFoods.widgetlib.createBrandLink(item.brand_id, item.brand_view));

    if (item.flags && item.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1)
        $('.button.report').addClass('reported')
            .html('Reported')
            .attr('title', 'This item has been reported.');

    if (data.userRating) {
        nofoodsRating.setUserValue(data.userRating.rating);
    } else {
        nofoodsRating.setValue(avg);
    }

    loadUserData();

    // Create the additional info div with the items data
    /*
    $('#infoDiv').nofoodzadditionalinfo({
        _id: item._id,
        type: PARAMS.type,
        info: item.info,
        update: item.user_id === Meteor.user()._id
     });*/

};

var loadUserData = function () {

    var user = Meteor.user();

    if (user.profile) {

        if (user.profile.wishlist) {
            for (var i = 0, l = user.profile.wishlist.length; i < l; i += 1) {
                if (user.profile.wishlist[i][idField] === PARAMS._id) {
                    $('.wishstar').toggleClass('x100', true);
                    break;
                }
            }
        }

    }

};

var reloadRating = function (item) {

    var avg = item.ratingtotal_calc > 0 ? (item.ratingtotal_calc / parseFloat(item.ratingcount_calc)).toFixed(2) : 0;

    if (avg != 0 && avg.lastIndexOf('0') === 3) {
        avg = avg.substring(0, 3);
        avg = avg.replace('.0', '');
    }

    $('.totalRating').html(avg);
    $('.totalCount').html(item.ratingcount_calc);

};

Template.foods.rendered = function () {

    var data = this.data;

    var obj = {
        _id: data._id,
        type: data.type
    };

    if (data.type === NoFoodz.consts.FOOD) {
        idField = 'food_id';
    } else if (data.type === NoFoodz.consts.DRINK) {
        idField = 'drink_id';
    } else {
        idField = 'product_id';
    }

    Meteor.call('getItemById', obj, done);

    nofoodsRating = $('div.ratingDiv').nofoodsrating({
        hearts: 6,
        select: function (rating) {

            var options = {
                rating: rating,
                _id: data._id,
                type: data.type
            };

            Meteor.call('updateRating', options, function (err, data) {
                reloadRating(data);
            });

        }
    });

    NoFoods.widgetlib.floatMenu($('#foods-nav'));

    $('span.wishstar').on('click', function () {
        var options = {};

        options[idField] = data._id;

        Meteor.call('addToWishList', options);

        $('.wishstar').toggleClass('x100', true);
    });

};
