/**
 * Created by Sora on 11/29/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, OnDestroy} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;

@Component({
    selector: 'people'
})

@View({
    templateUrl: 'client/users/people/people.html',
    directives: [RouterLink, ROUTER_DIRECTIVES]
})

export class People implements OnDestroy {

    screenData:any;

    constructor(private router:Router, params:RouteParams) {

        this.screenData = {
            username: params.get('username')
        };

        this.setup();
        this.loadListeners();

        this.loadUser();

    }

    ngOnDestroy() {

        jQuery(document).off('click', '#people_nav a');
        jQuery('span.wishstar').off('click');

    }

    setup() {

        Client.NoFoodz.widgetlib.floatMenu(jQuery('#people_nav'));

    }

    loadListeners() {

        jQuery(document).on('click', '#people_nav a', function (e) {
            e.preventDefault();
            jQuery(this).tab('show');
        });

    }

    loadUser() {

        var self = this;

        Meteor.call('findUser', {username: this.screenData.username}, function (err, response) {

            if (!err && response) {

                var user = response;

                var displayName = user.profile.name ? user.profile.name : user.username;

                jQuery('.people-name').html(displayName);

                self.findUserRatings(user);

                self.loadFollowingFlag(user._id, self.screenData.username);

            }

        });

    };

    loadFollowingFlag(user_id, username) {

        var obj = {
            user_id: user_id
        };

        Meteor.call('isFollowing', obj, function (err, response) {

            if (!err && response) {

                jQuery(".wishstar").toggleClass("x100", true);

            } else if (err) {
                jQuery('span.wishstar').hide();
            } else {
                jQuery('span.wishstar').on('click', function () {
                    Meteor.call('follow', {user_id: user_id, username: username});
                    jQuery(".wishstar").toggleClass("x100", true);
                });
            }

        });

    }

    findUserRatings(user) {

        this.getFoodsPage(user, 1, true);
        this.getDrinksPage(user, 1, true);
        this.getProductsPage(user, 1, true);

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
                'type': type.toLowerCase(),
                'user_id': pagingObj._id
            },
            t = type.toLowerCase();

        if (search)
            obj['search'] = search;
        if (count)
            obj['count'] = true;

        Meteor.call('getUserRatings', obj, function (err, data) {

            if (!err && data.items) {

                var itemDiv = jQuery('#people_ratings' + t);

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
                    jQuery('#people_' + t + ' .myfoods-paging').nofoodspaging({
                        max: data.count / data.maxPageSize,
                        select: func
                    });
                }

            }

        });

    }

}