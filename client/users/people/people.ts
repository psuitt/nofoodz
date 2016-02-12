/**
 * Created by Sora on 11/29/2015.
 */
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnDestroy, AfterViewInit} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'people'
})

@View({
    templateUrl: 'client/users/people/people.html',
    directives: [RouterLink, ROUTER_DIRECTIVES]
})

export class People implements OnDestroy, AfterViewInit {

    itemSearch:any;

    screenData:any;
    user_id:any;

    constructor(private router:Router, params:RouteParams) {

        this.screenData = {
            username: params.get('username')
        };

    }

    ngOnDestroy() {

        jQuery(document).off('click', '#people_nav a');
        jQuery('span.wishstar').off('click');

    }

    ngAfterViewInit() {
        this.setup();
        this.loadListeners();
        this.loadUser();
    }

    setup() {

        if (!jQuery('#people_ratingsearch_input').hasClass('nofoodssearch')) {
            this.itemSearch = jQuery('#people_ratingsearch_input').nofoodssearch({
                values: ['Food', 'Drink', 'Product', 'Media', 'Other'],
                searchPlaceholder: 'Search your items',
                select: this.getPageFunction()
            });
        }

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

                self.user_id = user._id;

                jQuery('.people-name').html(displayName);

                self.itemSearch.go();

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

    getPageFunction() {

        var self = this;

        return function (pagingObj, page, count) {
            self.getGenericPage(self.getGenericPage, {_id: self.user_id}, page, count, self.itemSearch.getType(), self.itemSearch.getSearch());
        };

    }

    getGenericPage(func, pagingObj, page, count, type, search) {

        var obj = {
                'page': page ? page : 1,
                'type': type.toLowerCase(),
                'user_id': pagingObj._id
            },
            t = type.toLowerCase();

        if (search)
            obj['search'] = search;
        if (count)
            obj['count'] = true;

        Meteor.call('getUserRatings', obj, function (err, data) {

            var itemDiv = jQuery('#people_ratingsitem');

            itemDiv.html('');

            if (!err && data.ratings && data.ratings.length !== 0) {

                _.each(data.ratings, function (rating, index, list) {
                    var div = Client.NoFoodz.widgetlib.createRatingDiv(rating, type);
                    itemDiv.append(div);
                });

                if (count) {
                    jQuery('.myfoods-paging').nofoodspaging({
                        max: data.count / data.maxPageSize,
                        select: func
                    });
                }

            } else {
                itemDiv.append('No ratings found');
            }

        });

    }

}