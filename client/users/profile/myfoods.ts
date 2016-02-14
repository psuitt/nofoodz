/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnDestroy, AfterViewInit} from 'angular2/core';

import {RouterLink, Router, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'myfoods'
})

@View({
    templateUrl: 'client/users/profile/myfoods.html',
    directives: [MyFoods, RouterLink, ROUTER_DIRECTIVES]
})

export class MyFoods implements OnDestroy, AfterViewInit {

    itemSearch:any;

    itemFirstLoad:boolean;
    followersFirstLoad:boolean;
    followingFirstLoad:boolean;

    PROFILE:number;
    ITEM:number;
    FOLLOWING:number;
    FOLLOWERS:number;

    constructor(private router:Router) {

        this.itemFirstLoad = true;
        this.followersFirstLoad = true;
        this.followingFirstLoad = true;

        this.PROFILE = 1;
        this.ITEM = 3;
        this.FOLLOWING = 5;
        this.FOLLOWERS = 6;

    }

    ngOnDestroy() {

        jQuery(document).off('click', '#myfoods_edit');
        jQuery(document).off('click', '#myfoods_save');
        jQuery('#myfoods-wishlist').off('click', 'button.remove', this.unlike);
        jQuery('#myfoods_following').off('click', 'button.remove', this.unfollow);
        jQuery('#mainContent').off('swiperight')
            .off('swipeleft')
            .removeClass('default');

    }

    ngAfterViewInit() {
        this.setup(this.router);
        this.loadListeners();
    }

    setup(router) {

        var self = this;

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

                    if (Client.NoFoodz.permissions.isAdmin(user) && jQuery('#myfoods-nav .nav-list .admin').length === 0) {
                        var adminHeader = jQuery('<li class=\'nav-header\'>Admin</li>');
                        var adminReported = jQuery('<li class=\'admin\'><a href=\'/#/admin/reported\'>Reported</a></li>');
                        jQuery('#myfoods-nav .nav-list').append(adminHeader)
                            .append(adminReported);
                    }

                }

                self.loadRatings();

            } else {
                router.navigate(['/Home']);
            }

        });

        if (!jQuery('#myfoods_item input').hasClass('nofoodssearch')) {
            this.itemSearch = jQuery('#myfoods_item input').nofoodssearch({
                values: ['Food', 'Drink', 'Product', 'Media', 'Other'],
                searchPlaceholder: 'Search your items',
                select: this.getPageFunction()
            });
        }

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
                    Client.NoFoodz.alert.msg('success', 'Save was successful!');
                } else {
                    Client.NoFoodz.alert.msg('danger', err.reason);
                }

            });
        });

        jQuery('#myfoods-wishlist').on('click', 'button.remove', this.unlike);

        jQuery('#myfoods_following').on('click', 'button.remove', this.unfollow);

        jQuery('#mainContent').removeClass('default')
            .on('swiperight', function () {
                jQuery('.row.row-offcanvas').addClass('active');
            })
            .on('swipeleft', function () {
                jQuery('.row.row-offcanvas').removeClass('active');
            });

    }

    loadFollowingFollowers(e) {
        e.preventDefault();
        jQuery(e.target).tab('show');
        var index = jQuery(e.target).parent().index();

        switch (index) {
            case this.ITEM:
                if (this.itemFirstLoad) {
                    this.itemSearch.go();
                    this.itemFirstLoad = false;
                }
                break;
            case this.FOLLOWING:
                if (this.followingFirstLoad) {
                    this.loadFollowing();
                    this.followingFirstLoad = false;
                }
                break;
            case this.FOLLOWERS:
                if (this.followersFirstLoad) {
                    this.loadFollowers();
                    this.followersFirstLoad = false;
                }
                break;
            default:
                jQuery('#myfoods_edit').toggle(index === this.PROFILE);
                break;
        }

    }

    unlike(e) {
        var options = {};
        if (jQuery(this).data('food_id')) {
            options['food_id'] = jQuery(this).data('food_id');
        } else {
            options['drink_id'] = jQuery(this).data('drink_id');
        }
        Meteor.call('removeFromWishList', options);
        jQuery(this).parent().remove();
        e.preventDefault();
    }

    unfollow(e) {
        Meteor.call('unfollow', {user_id: jQuery(this).data('user_id')});
        jQuery(this).parent().remove();
        e.preventDefault();
    }

    loadRatings() {

        var food_ids = [],
            drink_ids = [],
            fDiv = jQuery('#myfoods-ratingsfoods'),
            dDiv = jQuery('#myfoods-ratingsdrinks'),
            wDiv = jQuery('#myfoods-wishlist');

        wDiv.html('');

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
                    var removeLink = jQuery('<button class=\'red-button remove myfoods remove-color\' href=\'#\'>Unfollow</button>');
                    var username = following.username;

                    title.addClass('lower');

                    title.attr('href', Client.NoFoodz.consts.urls.PEOPLE + username);
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

                    title.attr('href', Client.NoFoodz.consts.urls.PEOPLE + username);
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

    getPageFunction() {

        var self = this;

        return function (pagingObj, page, count) {
            self.getGenericPage(self.getGenericPage, pagingObj, page, count, self.itemSearch.getType(), self.itemSearch.getSearch());
        };

    }

    getGenericPage(func, pagingObj, page, count, type, search) {

        var obj = {
                'page': page ? page : 1,
                'type': type
            },
            t = type.toLowerCase();

        if (search)
            obj['search'] = search;
        if (count)
            obj['count'] = true;

        Meteor.call('getUserRatings', obj, function (err, data) {

            var itemDiv = jQuery('#myfoods_ratingsitem');

            itemDiv.html('');

            if (!err && data.ratings && data.ratings.length !== 0) {

                _.each(data.ratings, function (rating, index, list) {
                    var div = Client.NoFoodz.widgetlib.createDisplay(rating, type, true);
                    itemDiv.append(div);
                });

                if (count) {
                    jQuery('#myfoods_item .myfoods-paging').nofoodspaging({
                        max: data.count / data.maxPageSize,
                        select: func
                    });
                }

            } else {
                itemDiv.append('No ratings found');
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
                        var removeLink = jQuery('<button class=\'red-button remove myfoods remove-color\' href=\'#\'>Remove</button>');

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
                        jQuery('.' + food._id + ' .name a').attr('href', Client.NoFoodz.consts.urls.FOOD + food._id).html(food.name);
                        jQuery('.' + food._id + ' .brand a').attr('href', Client.NoFoodz.consts.urls.BRAND + food.brand_id).html(food.brand_view);
                    }

                    if (data.drinks)
                        len = data.drinks.length;
                    for (var f = 0; f < len; f += 1) {
                        var drink = data.drinks[f];
                        jQuery('.' + drink._id + ' .name a').attr('href', Client.NoFoodz.consts.urls.DRINK + drink._id).html(drink.name);
                        jQuery('.' + drink._id + ' .brand a').attr('href', Client.NoFoodz.consts.urls.BRAND + drink.brand_id).html(drink.brand_view);
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