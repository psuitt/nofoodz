/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink, Router, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;

@Component({
    selector: 'myfoods'
})

@View({
    templateUrl: 'client/users/profile/myfoods.html',
    directives: [NgFor, RouterLink, ROUTER_DIRECTIVES]
})

export class MyFoods {

    followersFirstLoad:boolean;
    followingFirstLoad:boolean;

    PROFILE:number;
    FOLLOWING:number;
    FOLLOWERS:number;

    constructor(private router:Router) {

        this.followersFirstLoad = true;
        this.followingFirstLoad = true;

        this.PROFILE = 1;
        this.FOLLOWING = 7;
        this.FOLLOWERS = 8;

        this.setup(router);
        this.loadListeners();

    }

    onActivate() {
    }

    onDestroy() {
        jQuery('#mainContent').off('swiperight')
            .off('swipeleft')
            .removeClass('default');
    }

    setup(router) {

        var self = this;

        jQuery('#myfoods-nav a').click(function (e) {
            e.preventDefault();
            jQuery(this).tab('show');
            var index = jQuery(this).parent().index();

            switch (index) {
                case self.FOLLOWING:
                    if (self.followingFirstLoad) {
                        self.loadFollowing();
                        self.followingFirstLoad = false;
                    }
                    break;
                case self.FOLLOWERS:
                    if (self.followersFirstLoad) {
                        self.loadFollowers();
                        self.followersFirstLoad = false;
                    }
                    break;
                default:
                    jQuery('#myfoods_edit').toggle(index === self.PROFILE);
                    break;
            }

        });

        Client.NoFoodz.widgetlib.staticOffCanvasMenu(jQuery('#myfoods-nav'));

        Meteor.call('userData', function (err, response) {

            if (!err && response) {

                var user = response;

                if (user && user.profile) {

                    jQuery('#myfoods_username').text(user.username);
                    jQuery('#myfoods_name').text('( ' + user.profile.name + ' )');
                    jQuery('#myfoods_name_input').val(user.profile.name);
                    jQuery('#myfoods-joined').html('Joined ' + Client.NoFoodz.lib.formatDate(user.profile.date));
                    jQuery('#myfoods_bonus').html(user.profile.bonusHearts);

                    if (NoFoodz.client.permissions.isAdmin(user)) {
                        var adminHeader = jQuery('<li class=\'nav-header\'>Admin</li>');
                        var adminReported = jQuery('<li class=\'\'><a href=\'/#/admin/reported\'>Reported</a></li>');
                        jQuery('#myfoods-nav .nav-list').append(adminHeader)
                            .append(adminReported);
                    }

                }

                self.loadRatings();

            } else {
                router.navigate(['/Home']);
            }

        });

        jQuery('#myfoods-wishlist').on('click', 'a.remove', function (e) {
            var options = {};
            if (jQuery(this).data('food_id')) {
                options['food_id'] = jQuery(this).data('food_id');
            } else {
                options['drink_id'] = jQuery(this).data('drink_id');
            }
            Meteor.call('removeFromWishList', options);
            jQuery(this).parent().remove();
            e.preventDefault();
        });

        jQuery('#myfoods_following').on('click', 'a.remove', function (e) {
            Meteor.call('unfollow', {user_id: jQuery(this).data('user_id')});
            jQuery(this).parent().remove();
            e.preventDefault();
        });

        jQuery('#myfoods-foods .ratingsearch').on('keyup', function (e) {
            var code = Client.NoFoodz.lib.key.getCode(e),
                self = jQuery(this);

            if (code == 13) {
                self.getFoodsPage(1);
            }

        });

        jQuery('#myfoods-drinks .ratingsearch').on('keyup', function (e) {
            var code = Client.NoFoodz.lib.key.getCode(e),
                self = jQuery(this);

            if (code == 13) {
                self.getDrinksPage(1);
            }

        });

        jQuery('#mainContent').removeClass('default')
            .on('swiperight', function () {
                jQuery('.row.row-offcanvas').addClass('active');
            })
            .on('swipeleft', function () {
                jQuery('.row.row-offcanvas').removeClass('active');
            });
    }

    loadListeners() {

        jQuery(document).on('click', '#myfoods_edit', function (event) {

            jQuery('#myfoods_name_input').toggleClass('hidden');
            jQuery('#myfoods_save, #myfoods_name').toggle();

        });

        jQuery(document).on('click', '#myfoods_save', function (event) {

            var profile = {
                name: jQuery('#myfoods_name_input').val()
            };

            jQuery('#myfoods_name_input').toggleClass('hidden', true);
            jQuery('#myfoods_save').toggle(false);
            jQuery('#myfoods_name').toggle(true).text('( ' + profile.name + ' )');

            Meteor.call('updateProfile', profile, function (err) {

                if (!err) {
                    NoFoodz.alert.msg('success', 'Save was successful!');
                } else {
                    NoFoodz.alert.msg('danger', err.reason);
                }

            });
        });

    }

    loadRatings() {

        var food_ids = [],
            drink_ids = [],
            fDiv = jQuery('#myfoods-ratingsfoods'),
            dDiv = jQuery('#myfoods-ratingsdrinks'),
            wDiv = jQuery('#myfoods-wishlist');

        wDiv.html('');

        this.getFoodsPage(false, 1, true);
        this.getDrinksPage(false, 1, true);
        this.getProductsPage(false, 1, true);
        this.getWishlistPage(false, 1, true);

    }

    loadFollowing() {

        var contentDiv = jQuery('#myfoods_following');

        contentDiv.html('');

        Meteor.call('getFollowing', function (err, response) {

            if (!err && response.length > 0) {

                _.each(response, function (following, index) {

                    var div = jQuery('<div class=\'myrating myfoods\'></div>');
                    var title = jQuery('<a class=\'name myfoods user-color\'></a>');
                    var removeLink = jQuery('<a class=\'remove myfoods remove-color\' href=\'#\'>Unfollow</a>');
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

    }

    loadFollowers() {

        var contentDiv = jQuery('#myfoods_followers');

        contentDiv.html('');

        Meteor.call('getFollowers', function (err, response) {

            if (!err && response.length > 0) {

                _.each(response, function (follower, index) {

                    var div = jQuery('<div class=\'myrating myfoods\'></div>');
                    var title = jQuery('<a class=\'name myfoods user-color\'></a>');
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

    }

    getFoodsPage(pagingObj, page, count) {

        this.getGenericPage(this.getProductsPage, pagingObj, page, count, 'FOOD', false);

    }

    getDrinksPage(pagingObj, page, count) {

        this.getGenericPage(this.getProductsPage, pagingObj, page, count, 'DRINK', false);

    }

    getProductsPage(pagingObj, page, count) {

        this.getGenericPage(this.getProductsPage, pagingObj, page, count, 'PRODUCT', false);

    }

    getGenericPage(func, pagingObj, page, count, type, search) {

        var obj = {
                'page': page,
                'type': type
            },
            t = type.toLowerCase();

        if (search)
            obj['search'] = search;
        if (count)
            obj['count'] = true;

        Meteor.call('getUserRatings', obj, function (err, data) {

            if (!err && data.items) {

                var itemDiv = jQuery('#myfoods_ratings' + t);

                itemDiv.html('');

                var len = data.items.length;

                if (len !== 0) {

                    _.each(data.ratings, function (rating, index, list) {
                        var div = Client.NoFoodz.widgetlib.createRatingDiv(rating);
                        div.attr(t, rating.item_id);
                        itemDiv.append(div);
                    });

                    _.each(data.items, function (item, index, list) {
                        jQuery('[' + t + '=\'' + item._id + '\'] .name a').attr('href', NoFoodz.consts.urls[type] + item._id).html(item.name);
                        jQuery('[' + t + '=\'' + item._id + '\'] .brand a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);
                    });

                } else {
                    itemDiv.append('No ratings found');
                }

                if (count) {
                    jQuery('#myfoods_' + t + ' .myfoods-paging').nofoodspaging({
                        max: data.count / data.maxPageSize,
                        select: func
                    });
                }

            }

        });

    }

    getWishlistPage(data, page, count) {

        var self = this;

        var obj = {
            page: page
        };

        if (count)
            obj['count'] = true;

        Meteor.call('getUserWishlist', obj, function (err, data) {

            if (!err) {

                var wDiv = jQuery('#myfoods-wishlist'),
                    wishlist = data.wishlist,
                    len = 0;

                wDiv.html('');

                if (wishlist) {

                    for (var i = 0, l = wishlist.length; i < l; i += 1) {

                        var div = jQuery('<div class=\'myrating myfoods\'></div>');
                        var title = jQuery('<span class=\'name myfoods item-color\'><a></a></span>');
                        var brand = jQuery('<span class=\'brand myfoods brand-color\'><a></a></span>');
                        var removeLink = jQuery('<a class=\'remove myfoods remove-color\' href=\'#\'>Remove</a>');

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
                        len = data.foods.length;
                    for (var f = 0; f < len; f += 1) {
                        var food = data.foods[f];
                        jQuery('.' + food._id + ' .name a').attr('href', NoFoodz.consts.urls.FOOD + food._id).html(food.name);
                        jQuery('.' + food._id + ' .brand a').attr('href', NoFoodz.consts.urls.BRAND + food.brand_id).html(food.brand_view);
                    }

                    if (data.drinks)
                        len = data.drinks.length;
                    for (var f = 0; f < len; f += 1) {
                        var drink = data.drinks[f];
                        jQuery('.' + drink._id + ' .name a').attr('href', NoFoodz.consts.urls.DRINK + drink._id).html(drink.name);
                        jQuery('.' + drink._id + ' .brand a').attr('href', NoFoodz.consts.urls.BRAND + drink.brand_id).html(drink.brand_view);
                    }

                }

                if (len === 0) {
                    wDiv.append('No wish list items found');
                }

                if (count) {
                    jQuery('#myfoods-wishlistpage .myfoods-paging').nofoodspaging({
                        max: data.count / data.maxPageSize,
                        select: self.getWishlistPage
                    });
                }

            }

        });
    }

}