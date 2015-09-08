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

    $('.food-name').html(item.name);
    $('.brand').html(NoFoods.widgetlib.createBrandLink(item.brand_id, item.brand_view));
    $('.totalRating').html(item.rating_calc);
    $('.totalCount').html(item.ratingcount_calc);

    if (item.flags && item.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1)
        $('.button.report').addClass('reported')
            .html('Reported')
            .attr('title', 'This item has been reported.');

    if (data.userRating) {
        nofoodsRating.setUserValue(data.userRating.rating);
    } else {
        nofoodsRating.setValue(item.rating_calc);
    }

    loadUserData();

    // Create the additional info div with the items data
    $('#infoDiv').nofoodzadditionalinfo({
        _id: item._id,
        type: PARAMS.type,
        info: item.info,
        update: item.user_id === Meteor.user()._id
    });

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

var reload = function (response) {

    $('.totalRating').html(response.data.rating_calc);
    $('.totalCount').html(response.data.ratingcount_calc);

};

Template.foods.rendered = function () {

    var data = this.data;

    var obj = {
        _id: data._id,
        type: data.type
    };

    if (data.type === NoFoodz.consts.FOOD) {
        idField = 'food_id';
    } else {
        idField = 'drink_id';
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
                var response = {};
                response.error = err;
                response.data = data;
                reload(response);
            });

        }
    });

    NoFoods.widgetlib.floatMenu($('#foods-nav'));

    $('span.wishstar').on('click', function () {
        var options = {};

        options[idField] = PARAMS._id;

        Meteor.call('addToWishList', options);

        $('.wishstar').toggleClass('x100', true);
    });

};
