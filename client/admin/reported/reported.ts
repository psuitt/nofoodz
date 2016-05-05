/**
 * Created by Sora on 11/30/2015.
 */
import {Component, OnInit} from 'angular2/core';

import {NgFor} from 'angular2/common';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

declare var jQuery:any;
declare var Client:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'reported',
    templateUrl: 'client/admin/reported/reported.html',
    directives: [Reported, RouterLink, ROUTER_DIRECTIVES, NgFor]
})

export class Reported extends MeteorComponent implements OnInit {

    screenData:any;
    items:any;

    constructor(private router:Router, params:RouteParams) {
        super();

        var obj = {
            page: 1
        };

        this.autorun(() => {
            this.call('findReportedItems', obj, (err, data) => {
                this.items = data.foods;
            });
        });
    }

    ngOnInit() {

    }

    createGetReportedPage() {

        var self = this;

        return function (page, count) {

            var obj = {
                page: page
            };

            if (count)
                obj['count'] = true;

            self.call('findReportedItems', obj, function (err, data) {

                var contentDiv = jQuery("#reported-content");

                contentDiv.html('');

                if (!err && data) {

                    self.createItemsRow(data.foods, Client.NoFoodz.consts.FOOD);
                    self.createItemsRow(data.drinks, Client.NoFoodz.consts.DRINK);

                    if (count) {
                        jQuery(".myfoods-paging").nofoodspaging({
                            max: data.count / data.maxPageSize,
                            select: self.createGetReportedPage()
                        });
                    }

                } else {
                    Client.NoFoodz.alert.msg('danger', err.message);
                }

            });

        };
    }

    remove(event, type, id) {

        var options = {
            items: []
        };

        var item = {
            _id: id,
            type: type
        };

        options.items.push(item);

        alert('Removing item. ' + item._id + ' type: ' + item.type);

        //  Meteor.call('removeItems', options, function (err) {
        //   if (!err) {
        //       Client.NoFoodz.alert.msg('success', 'Remove was successful');
        //    }
        //});
        jQuery(event.target).parent().remove();

    }

    createItemsRow(list, type) {

        if (!list)
            return;

        var contentDiv = jQuery("#reported-content");

        for (var i = 0, len = list.length; i < len; i += 1) {

            var item = list[i];
            var div = jQuery("<div class='myrating myfoods'></div>");
            var title = jQuery("<span class='name item-color myfoods'></span>");
            var brand = jQuery("<span class='brand brand-color myfoods'></span>");
            var removeLink = jQuery("<button class='remove red-button' removeitem>Remove</button>");
            var link = '';

            title.addClass('lower');

            link = jQuery('<a></a>').attr('href', Client.NoFoodz.consts.urls[type.toUpperCase()] + item._id)
                .html(item.name);
            removeLink.data('type', type);
            removeLink.data('_id', item._id);

            title.append(link);

            var brandLink = jQuery('<a></a>').attr('href', Client.NoFoodz.consts.urls.BRAND + item.brand_id)
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