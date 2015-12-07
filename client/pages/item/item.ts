/**
 * Created by Sora on 11/28/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;

@Component({
    selector: 'item'
})

@View({
    templateUrl: 'client/pages/item/item.html',
    directives: [Item, RouterLink, ROUTER_DIRECTIVES]
})

export class Item {

    nofoodsRating:any;
    idField:string;
    screenData:any;
    user:any;

    constructor(private router:Router, params:RouteParams) {

        this.screenData = {
            _id: params.get('_id'),
            type: params.get('type')
        };

        this.setup(router);
        this.loadListeners();

    }

    onDestroy() {
        this.nofoodsRating.remove();

        jQuery('span.wishstar').off('click');
        jQuery('.food-menu-link').off('click');

        jQuery(document).off('click', '#foods_comment');
        jQuery(document).off('click', '#foods_editcomments');

    }

    setup(router) {

        var self = this;

        var obj = {
            _id: this.screenData._id,
            type: this.screenData.type
        };

        if (this.screenData.type === NoFoodz.consts.FOOD) {
            this.idField = 'food_id';
        } else if (this.screenData.type === NoFoodz.consts.DRINK) {
            this.idField = 'drink_id';
        } else {
            this.idField = 'product_id';
        }

        Meteor.call('getItemById', obj, function (err, response) {

            if (err || !response || !response.item) {
                router.navigate(['/Error404']);
            }

            self.done(self, err, response);

        });

        this.reloadComments();

        this.nofoodsRating = jQuery('#foods_bodydiv div.ratingDiv').nofoodsrating({
            hearts: 6,
            select: function (rating) {

                var options = {
                    rating: rating,
                    _id: self.screenData._id,
                    type: self.screenData.type
                };

                Meteor.call('updateRating', options, function (err, data) {

                    if (!err) {
                        self.reloadRating(data);
                        jQuery('#foods_commentsdiv').removeClass('no-user-rating');
                    }

                });

            }
        });

        Client.NoFoodz.widgetlib.floatMenu(jQuery('#foods-nav'));

        jQuery('#foods-nav .button.report').attr('item-id', self.screenData._id).attr('item-type', self.screenData.type);

    }

    loadListeners() {

        var self = this;

        jQuery('span.wishstar').on('click', function () {
            var options = {};

            options[self.idField] = self.screenData._id;

            Meteor.call('addToWishList', options);

            jQuery('.wishstar').toggleClass('x100', true);
        });

        jQuery('.food-menu-link').on('click', function (e) {
            var self = jQuery(this);
            e.preventDefault();
            jQuery('#foods-nav li').removeClass('active');
            self.parent().addClass('active');
            var height = jQuery(self.attr('link')).offset().top - jQuery('#menu').height(),
                currentHeight = jQuery('body').scrollTop(),
                max = jQuery(document).height() - jQuery(window).height();

            if ((currentHeight !== max && height > currentHeight)
                || (height < currentHeight)) {
                jQuery('body').animate({
                    scrollTop: height
                }, 300);
            }

            return false;
        });

        jQuery(document).on('click', '#foods_comment', function (event) {

            var comments = [];

            jQuery('.foods-comment-input').each(function () {
                var val = jQuery(this).val();
                if (val)
                    comments.push(val);
            });

            var obj = {
                item_id: self.screenData._id,
                type: self.screenData.type,
                comments: comments
            };

            Meteor.call('updateComments', obj, function (err) {

                if (!err) {
                    NoFoodz.alert.msg('success', 'Save was successful!');
                    self.setCommentsInputs(comments);
                    self.reloadComments();
                } else {
                    NoFoodz.alert.msg('danger', 'Save was unsuccessful!');
                }

            });

        });

        jQuery(document).on('click', '#foods_editcomments', function (event) {

            jQuery('#foods_commentsdiv').toggleClass('comment-mode').toggleClass('display-mode');

        });

    }

    done(self, err, data) {

        var item = data.item;

        var avg = self.reloadRating(item);

        jQuery('.food-name').html(item.name);
        jQuery('.brand').html(Client.NoFoodz.widgetlib.createBrandLink(item.brand_id, item.brand_view));

        if (item.flags && item.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1)
            jQuery('.button.report').addClass('reported')
                .html('Reported')
                .attr('title', 'This item has been reported.');

        if (data.userRating) {
            self.nofoodsRating.setUserValue(data.userRating.rating);
            var comments = data.userRating.comments;
            self.setCommentsInputs(comments);
            jQuery('#foods_commentsdiv').removeClass('no-user-rating');
        } else {
            self.nofoodsRating.setValue(avg);
        }

        self.loadUserData(item._id);

    }

    reloadComments() {

        Meteor.call('findCommentsForItem', {
            item_id: this.screenData._id,
            type: this.screenData.type
        }, this.loadComments);

    }

    setCommentsInputs(comments) {

        if (comments && comments.length > 0) {

            jQuery('#foods_commentsdiv').removeClass('comment-mode no-comments').addClass('display-mode');

            var inputs = jQuery('.foods-comment-input');
            var spans = jQuery('.foods-comment');

            inputs.eq(0).val(comments[0]).attr('default', comments[0]);
            inputs.eq(1).val(comments[1]).attr('default', comments[1]);
            inputs.eq(2).val(comments[2]).attr('default', comments[2]);

            spans.eq(0).text(comments[0]).attr('default', comments[0]);
            spans.eq(1).text(comments[1]).attr('default', comments[1]);
            spans.eq(2).text(comments[2]).attr('default', comments[2]);

        }

    }

    loadUserData(id) {

        this.user = Meteor.user();

        if (!this.user) {
            jQuery('#foods-nav .button.report').parent().hide();
            return;
        } else {
            jQuery('#foods-nav .button.report').parent().show();
        }

        if (this.user.profile) {

            if (this.user.profile.wishlist) {
                for (var i = 0, l = this.user.profile.wishlist.length; i < l; i += 1) {
                    if (this.user.profile.wishlist[i][this.idField] === id) {
                        jQuery('.wishstar').toggleClass('x100', true);
                        break;
                    }
                }
            }

        }

    }

    reloadRating(item) {

        var avg = new String(item.ratingtotal_calc > 0 ? (item.ratingtotal_calc / parseFloat(item.ratingcount_calc)).toFixed(2) : 0);

        if (avg != '0' && avg.lastIndexOf('0') === 3) {
            avg = avg.substring(0, 3);
            avg = avg.replace('.0', '');
        }

        jQuery('.totalRating').html(avg);
        jQuery('.total-count').html(item.ratingcount_calc);

        return avg;

    }

    loadComments(err, response) {

        jQuery('#foods_comments').jQCloud([{text: 'Empty Comments', weight: 1}], {
            height: 300
        });

        if (!err && response.length > 0) {

            var words = [];

            _.each(response, function (comment, index) {

                words.push({
                    text: comment.comment,
                    weight: comment.value
                });

            });

            jQuery('#foods_comments').jQCloud('update', words);

        }

    }

    loadRaters(event, all) {

        // Do not redirect
        event.preventDefault();

        jQuery('#item_raterstablist .active').removeClass('active');
        jQuery(event.target).addClass('active');

        var obj = {
            page: 1,
            _id: this.screenData._id,
            type: this.screenData.type
        };

        if (!all) {
            obj['user_id'] = this.user._id;
        }

        jQuery('#item_raterslist').html('');

        Meteor.call('getAllRaters', obj, function (err, data) {

            if (!err && data) {

                _.each(data, function (rater, index) {

                    var li = jQuery('<li></li>');
                    var a = jQuery('<a></a>');
                    var username = rater.username_view ? rater.username_view : "Unknown"

                    a.attr('href', NoFoodz.consts.urls.PEOPLE + username.toLowerCase());

                    a.text(username);

                    li.append(a);

                    jQuery('#item_raterslist').append(li);

                });

            }


        });

    }

    toggleRaters(event) {

        // Do not redirect
        event.preventDefault();

        jQuery('#item_raters').toggleClass('visible');

    }

}