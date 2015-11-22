var foodSearch,
    drinkSearch,
    followersFirstLoad = true,
    followingFirstLoad = true;

var PROFILE = 1;
var FOLLOWING = 7;
var FOLLOWERS = 8;

Template.myfoods.events({

    'click #myfoods_edit': function (event, template) {

        $('#myfoods_name_input').toggleClass('hidden');
        $('#myfoods_save, #myfoods_name').toggle();

    },

    'click #myfoods_save': function (event, template) {

        var profile = {
            name: template.find('#myfoods_name_input').value
        };

        $('#myfoods_name_input').toggleClass('hidden', true);
        $('#myfoods_save').toggle(false);
        $('#myfoods_name').toggle(true).text('( ' + profile.name + ' )');

        Meteor.call('updateProfile', profile, function (err) {

            if (!err) {
                NoFoodz.alert.msg('success', 'Save was successful!');
            } else {
                NoFoodz.alert.msg('danger', err);
            }

        });
    }
});

Template.myfoods.destroyed = function () {
    $('#mainContent').off('swiperight')
        .off('swipeleft')
        .removeClass('default');
};

Template.myfoods.rendered = function () {

    if (!Meteor.userId()) {
        Router.go('home');
        return;
    }

    $('#myfoods-nav a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        var index = $(this).parent().index();

        switch (index) {
            case FOLLOWING:
                if (followingFirstLoad) {
                    loadFollowing();
                    followingFirstLoad = false;
                }
                break;
            case FOLLOWERS:
                if (followersFirstLoad) {
                    loadFollowers();
                    followersFirstLoad = false;
                }
                break;
            default:
                $('#myfoods_edit').toggle(index === PROFILE);
                break;
        }

    });

    NoFoods.widgetlib.staticOffCanvasMenu($('#myfoods-nav'));

    Meteor.call('userData', function (err, response) {

        if (!err && response) {

            var user = response;

            if (user && user.profile) {

                $('#myfoods_username').text(user.username);
                $('#myfoods_name').text('( ' + user.profile.name + ' )');
                $('#myfoods_name_input').val(user.profile.name);
                $('#myfoods-joined').html('Joined ' + NoFoods.lib.formatDate(user.profile.date));
                $('#myfoods_bonus').html(user.profile.bonusHearts);

                if (NoFoodz.client.permissions.isAdmin(user)) {
                    var adminHeader = $('<li class=\'nav-header\'>Admin</li>');
                    var admin = $('<li class=\'\'><a href=\'/admin\'>Admin</a></li>');
                    var adminReported = $('<li class=\'\'><a href=\'/admin/reported\'>Reported</a></li>');
                    $('#myfoods-nav .nav-list').append(adminHeader)
                        .append(admin)
                        .append(adminReported);
                }

            }

            loadRatings();

        }

    });

    $('#myfoods-wishlist').on('click', 'a.remove', function (e) {
        var options = {};
        if ($(this).data('food_id')) {
            options.food_id = $(this).data('food_id');
        } else {
            options.drink_id = $(this).data('drink_id');
        }
        Meteor.call('removeFromWishList', options);
        $(this).parent().remove();
        e.preventDefault();
    });

    $('#myfoods_following').on('click', 'a.remove', function (e) {
        Meteor.call('unfollow', {user_id: $(this).data('user_id')});
        $(this).parent().remove();
        e.preventDefault();
    });

    $('#myfoods-foods .ratingsearch').on('keyup', function (e) {
        var code = NoFoods.lib.key.getCode(e),
            self = $(this);

        if (code == 13) {
            foodSearch = self.val();
            getFoodsPage(1);
        }

    });

    $('#myfoods-drinks .ratingsearch').on('keyup', function (e) {
        var code = NoFoods.lib.key.getCode(e),
            self = $(this);

        if (code == 13) {
            drinkSearch = self.val();
            getDrinksPage(1);
        }

    });

    $('#mainContent').removeClass('default')
        .on('swiperight', function () {
            $('.row.row-offcanvas').addClass('active');
        })
        .on('swipeleft', function () {
            $('.row.row-offcanvas').removeClass('active');
        });

};

var loadRatings = function () {

    var food_ids = [],
        drink_ids = [],
        fDiv = $('#myfoods-ratingsfoods'),
        dDiv = $('#myfoods-ratingsdrinks'),
        wDiv = $('#myfoods-wishlist');

    wDiv.html('');

    getFoodsPage(false, 1, true);
    getDrinksPage(false, 1, true);
    getProductsPage(false, 1, true);
    getWishlistPage(false, 1, true);

};

var loadFollowing = function () {

    var contentDiv = $('#myfoods_following');

    contentDiv.html('');

    Meteor.call('getFollowing', function (err, response) {

        if (!err && response.length > 0) {

            _.each(response, function (following, index) {

                var div = $('<div class=\'myrating myfoods\'></div>');
                var title = $('<a class=\'name myfoods user-color\'></a>');
                var removeLink = $('<a class=\'remove myfoods remove-color\' href=\'#\'>Unfollow</a>');
                var username = following.username;

                title.addClass('lower');

                title.attr('href', NoFoodz.consts.urls.PEOPLE + username);
                title.html(username);

                removeLink.data('user_id', following.user_id);

                div.append(title);
                div.append(removeLink);

                // Reverse the order they were added.
                contentDiv.prepend(div);

            });

        } else {
            contentDiv.append('No followed users found');
        }

    });

};

var loadFollowers = function () {

    var contentDiv = $('#myfoods_followers');

    contentDiv.html('');

    Meteor.call('getFollowers', function (err, response) {

        if (!err && response.length > 0) {

            _.each(response, function (follower, index) {

                var div = $('<div class=\'myrating myfoods\'></div>');
                var title = $('<a class=\'name myfoods user-color\'></a>');
                var username = follower.followername;

                title.addClass('lower');

                title.attr('href', NoFoodz.consts.urls.PEOPLE + username);
                title.html(username);

                div.append(title);

                // Reverse the order they were added.
                contentDiv.prepend(div);

            });

        } else {
            contentDiv.append('No followers found');
        }

    });

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
            'type': type
        },
        t = type.toLowerCase();

    if (search)
        obj['search'] = search;
    if (count)
        obj.count = true;

    Meteor.call('getUserRatings', obj, function (err, data) {

        if (!err && data.items) {

            var itemDiv = $('#myfoods_ratings' + t);

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
                $('#myfoods_' + t + ' .myfoods-paging').nofoodspaging({
                    max: data.count / data.maxPageSize,
                    select: func
                });
            }

        }

    });

};

var getWishlistPage = function (data, page, count) {

    var obj = {
        page: page
    };

    if (drinkSearch)
        obj['search'] = drinkSearch;
    if (count)
        obj.count = true;

    Meteor.call('getUserWishlist', obj, function (err, data) {

        if (!err) {

            var wDiv = $('#myfoods-wishlist'),
                wishlist = data.wishlist,
                len = 0;

            wDiv.html('');

            if (wishlist) {

                for (var i = 0, l = wishlist.length; i < l; i += 1) {

                    var div = $('<div class=\'myrating myfoods\'></div>');
                    var title = $('<span class=\'name myfoods item-color\'><a></a></span>');
                    var brand = $('<span class=\'brand myfoods brand-color\'><a></a></span>');
                    var removeLink = $('<a class=\'remove myfoods remove-color\' href=\'#\'>Remove</a>');

                    title.addClass('lower');

                    if (wishlist[i].food_id) {
                        div.addClass(wishlist[i].food_id);
                        removeLink.data('food_id', wishlist[i].food_id);
                    } else {
                        div.addClass(wishlist[i].drink_id);
                        removeLink.data('drink_id', wishlist[i].drink_id);
                    }

                    div.append(title);
                    div.append(brand);
                    div.append(removeLink);

                    // Reverse the order they were added.
                    wDiv.prepend(div);

                }

                if (data.foods)
                    for (var f = 0, len = data.foods.length; f < len; f += 1) {
                        var food = data.foods[f];
                        $('.' + food._id + ' .name a').attr('href', NoFoodz.consts.urls.FOOD + food._id).html(food.name);
                        $('.' + food._id + ' .brand a').attr('href', NoFoodz.consts.urls.BRAND + food.brand_id).html(food.brand_view);
                    }

                if (data.drinks)
                    for (var f = 0, len = data.drinks.length; f < len; f += 1) {
                        var drink = data.drinks[f];
                        $('.' + drink._id + ' .name a').attr('href', NoFoodz.consts.urls.DRINK + drink._id).html(drink.name);
                        $('.' + drink._id + ' .brand a').attr('href', NoFoodz.consts.urls.BRAND + drink.brand_id).html(drink.brand_view);
                    }

            }

            if (len === 0) {
                wDiv.append('No wish list items found');
            }

            if (count) {
                $('#myfoods-wishlistpage .myfoods-paging').nofoodspaging({
                    max: data.count / data.maxPageSize,
                    select: getWishlistPage
                });
            }

        }

    });
};
