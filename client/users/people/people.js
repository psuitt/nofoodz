Template.people.destroyed = function () {
};

Template.people.rendered = function () {

    var data = this.data;

    $('span.wishstar').on('click', function () {
        Meteor.call('addToLinks', {username: data.username});
        $(".wishstar").toggleClass("x100", true);
    });


    NoFoods.widgetlib.floatMenu($('#people_nav'));

    loadUser(data);

    $('div.nofoods-pagenav a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

};

var loadUser = function (data) {

    Meteor.call('findUser', {username: data.username}, function (err, response) {

        if (!err && response) {

            var user = response;

            var displayName = user.profile.name ? user.profile.name : user.username;

            $('.people-name').html(displayName);

            findUserRatings(user);

            loadFollowingFlag(user._id, user.username)

        }

    });

};

var loadFollowingFlag = function (user_id, username) {

    var obj = {
        user_id: user_id,
        username: username
    };

    Meteor.call('isFollowing', obj, function (err, response) {

        if (!err && response) {

            $(".wishstar").toggleClass("x100", true);

        }

    });

};

var findUserRatings = function (user) {

    getFoodsPage(user, 1, true);
    getDrinksPage(user, 1, true);
    getProductsPage(user, 1, true);

};

var getFoodsPage = function (pagingObj, page, count) {

    getGenericPage(getProductsPage, pagingObj, page, count, 'FOOD');

};

var getDrinksPage = function (pagingObj, page, count) {

    getGenericPage(getProductsPage, pagingObj, page, count, 'DRINK');

};

var getProductsPage = function (pagingObj, page, count) {

    getGenericPage(getProductsPage, pagingObj, page, count, 'PRODUCT');

};

var getGenericPage = function (func, pagingObj, page, count, type, search) {

    var obj = {
            'page': page,
            'type': type.toLowerCase(),
            'user_id': pagingObj._id
        },
        t = type.toLowerCase();

    if (search)
        obj['search'] = search;
    if (count)
        obj.count = true;

    Meteor.call('getUserRatings', obj, function (err, data) {

        if (!err && data.items) {

            var itemDiv = $('#people_ratings' + t);

            itemDiv.html('');

            var len = data.items.length;

            if (len !== 0) {

                _.each(data.ratings, function (rating, index, list) {
                    var div = NoFoods.widgetlib.createRatingDiv(rating);
                    div.attr(t, rating.item_id);
                    itemDiv.append(div);
                });

                _.each(data.items, function (item, index, list) {
                    $('[' + t + '=\'' + item._id + '\'] .name a').attr('href', NoFoodz.consts.urls[type] + item._id).html(item.name);
                    $('[' + t + '=\'' + item._id + '\'] .brand a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);
                });

            } else {
                itemDiv.append('No ratings found');
            }

            if (count) {
                $('#people_' + t + ' .myfoods-paging').nofoodspaging({
                    max: data.count / data.maxPageSize,
                    select: func
                });
            }

        }

    });

};
