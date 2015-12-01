/**
 * Created by Sora on 11/30/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var NoFoodz:any;
declare var _:any;

@Component({
    selector: 'reported'
})

@View({
    templateUrl: 'client/admin/reported/reported.html',
    directives: [NgFor, RouterLink, ROUTER_DIRECTIVES]
})

export class Reported {

    screenData:any;

    constructor(private router:Router, params:RouteParams) {

        this.setup();
        this.loadListeners();

    }

    setup() {

        this.createGetReportedPage()(1, false);

    }

    loadListeners() {

        var self = this;

        jQuery('#reported-content').on('click', 'a.remove', function (e) {

            var options = {
                items: []
            };

            var item = {
                _id: '',
                type: ''
            };

            if (jQuery(this).data('food_id')) {
                item._id = jQuery(this).data('food_id');
                item.type = NoFoodz.consts.FOOD;
            } else {
                item._id = jQuery(this).data('drink_id');
                item.type = NoFoodz.consts.DRINK;
            }

            options.items.push(item);

            Meteor.call('removeItems', options, self.success);
            jQuery(this).parent().remove();
            e.preventDefault();
        });

    }

    success(err) {

        if (!err) {
            NoFoodz.alert.msg('success', 'Remove was successful');
        }

    };

    createGetReportedPage() {

        var self = this;

        return function (page, count) {

            var obj = {
                page: page
            };

            if (count)
                obj['count'] = true;

            Meteor.call('findReportedItems', obj, function (err, data) {

                var contentDiv = jQuery("#reported-content");

                contentDiv.html('');

                if (!err && data) {

                    self.createItemsRow(data.foods, NoFoodz.consts.FOOD);
                    self.createItemsRow(data.drinks, NoFoodz.consts.DRINK);

                    if (count) {
                        jQuery(".myfoods-paging").nofoodspaging({
                            max: data.count / data.maxPageSize,
                            select: self.createGetReportedPage()
                        });
                    }

                } else {
                    NoFoodz.alert.msg('danger', err.message);
                }

            });

        };
    }

    createItemsRow(list, type) {

        if (!list)
            return;

        var contentDiv = jQuery("#reported-content");

        for (var i = 0, len = list.length; i < len; i += 1) {

            var item = list[i];
            var div = jQuery("<div class='myrating myfoods'></div>");
            var title = jQuery("<span class='name myfoods'></span>");
            var brand = jQuery("<span class='brand myfoods'></span>");
            var removeLink = jQuery("<a class='remove myfoods' href='#'>Remove</a>");
            var link = '';

            title.addClass('lower');

            if (type === NoFoodz.consts.FOOD) {
                link = jQuery('<a></a>').attr('href', NoFoodz.consts.urls.FOOD + item.brand_id)
                    .html(item.name);
                removeLink.data('food_id', item._id);
            } else {
                link = jQuery('<a></a>').attr('href', NoFoodz.consts.urls.DRINK + item.brand_id)
                    .html(item.name);
                removeLink.data('drink_id', item._id);
            }

            title.append(link);

            var brandLink = jQuery('<a></a>').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id)
                .html(item.brand_view);

            brand.append(brandLink);

            div.append(title);
            div.append(brand);
            div.append(removeLink);

            // Reverse the order they were added.
            contentDiv.append(div);

        }

    }

}