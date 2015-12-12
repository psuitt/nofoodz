/**
 * Created by Sora on 11/30/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, Directive, HostListener, OnInit} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

declare var jQuery:any;
declare var NoFoodz:any;
declare var _:any;

@Directive({
    selector: '[removeitem]'
})
class RemoveDirective {

    @HostListener('click', ['$event.target'])
    onClick(btn) {

        console.log('THis works');

        return false;

        var options = {
            items: []
        };

        var item = {
            _id: '',
            type: ''
        };

        item._id = jQuery(this).data('_id');
        item.type = jQuery(this).data('type');

        options.items.push(item);

        Meteor.call('removeItems', options, function (err) {
            if (!err) {
                NoFoodz.alert.msg('success', 'Remove was successful');
            }
        });
        jQuery(btn).parent().remove();

        // Prevent default
        return false;

    }
}

@Component({
    selector: 'reported'
})

@View({
    templateUrl: 'client/admin/reported/reported.html',
    directives: [RemoveDirective, RouterLink, ROUTER_DIRECTIVES]
})

export class Reported extends MeteorComponent implements OnInit {

    screenData:any;
    reportedItems:any;

    constructor(private router:Router, params:RouteParams) {
        super();
    }

    ngOnInit() {

        this.createGetReportedPage()(1, false);

    }

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
            var title = jQuery("<span class='name item-color myfoods'></span>");
            var brand = jQuery("<span class='brand brand-color myfoods'></span>");
            var removeLink = jQuery("<button class='remove red-button' removeitem>Remove</button>");
            var link = '';

            title.addClass('lower');

            link = jQuery('<a></a>').attr('href', NoFoodz.consts.urls[type.toUpperCase()] + item._id)
                .html(item.name);
            removeLink.data('type', type);
            removeLink.data('_id', item._id);

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