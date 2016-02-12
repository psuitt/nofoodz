/**
 * Created by Sora on 11/29/2015.
 */
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnDestroy, AfterViewInit} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'brand'
})

@View({
    templateUrl: 'client/pages/brand/brand.html',
    directives: [RouterLink, ROUTER_DIRECTIVES]
})

export class Brand extends MeteorComponent implements OnDestroy, AfterViewInit {

    screenData:any;
    ITEMS_TO_READ:Array<String> = [
        "food",
        "drink"
    ];

    constructor(private router:Router, params:RouteParams) {

        super();

        this.screenData = {
            _id: params.get('_id')
        };

    }

    ngOnDestroy() {

        jQuery(document).off('click', '#brands-nav a');

    }

    ngAfterViewInit() {
        this.setup();
        this.loadListeners();
    }

    setup() {

        jQuery('#brand_content').html('');

        this.fetchData();

        Client.NoFoodz.widgetlib.floatMenu(jQuery('#brands-nav'));

        var user = Meteor.user();

        if (user) {
            jQuery('#foods-nav .button.report').show().attr('item-id', this.screenData._id);
            jQuery('#brand_additem').show().attr('href', '/#/pages/add?brand_id=' + this.screenData._id);
        } else {
            jQuery('#foods-nav .button.report').hide();
            jQuery('#brand_additem').hide();
        }

    }

    loadListeners() {
        jQuery(document).on('click', '#brands-nav a', function (e) {
            if (!jQuery(this).hasClass('button')) {
                e.preventDefault();
                jQuery(this).tab('show');
            }
        });
    }

    fetchData() {

        var self = this;

        var obj = {
            brand_id: this.screenData._id
        };

        var something = this.call('getAllByBrand', obj);

        this.call('getAllByBrand', obj, function (err, data) {

            if (!err) {

                var brand = data.brand;

                if (!brand)
                    self.router.navigate(['/Error404']);

                jQuery('.brand-name').html(brand.name);

                if (brand.flags && brand.flags.indexOf(Client.NoFoodz.consts.flags.REPORTED) !== -1)
                    jQuery('.button.report').addClass('reported')
                        .html('Reported')
                        .attr('title', 'This item has been reported.');

                _.each(self.ITEMS_TO_READ, function (item, index) {
                    self.loadItems(data[item + 's'], item);
                });

                jQuery('[data-toggle=\'tooltip\']').tooltip();

            }

        });

    }

    loadItems(items, type) {

        if (items && items.length > 0) {

            var avg = '0',
                content = jQuery('#brand_content'),
                header = jQuery('<h4></h4>');

            header.text(Client.NoFoodz.format.camelCase(type + 's'));
            header.addClass('section-title');

            content.append(header);

            var total = 0;
            var count = 0;

            _.each(items, function (item, index) {

                var div = jQuery('<div></div>'),
                    link = jQuery('<a></a>'),
                    ratingTotal = parseInt(item.ratingtotal_calc, 10),
                    ratingCount = parseInt(item.ratingcount_calc, 10);

                link.addClass('item-color');
                link.attr('href', Client.NoFoodz.consts.urls[type.toUpperCase()] + item._id).html(item.name);

                var avgRating = Client.NoFoodz.format.calculateAverageDisplay(item);

                div.append(Client.NoFoodz.widgetlib.createHeart(avgRating, item.ratingcount_calc));

                total += isNaN(ratingTotal) ? 0 : ratingTotal;
                count += isNaN(ratingCount) ? 0 : ratingCount;

                div.append(link);

                content.append(div);

            });

            if (total > 0) {
                avg = (total / parseFloat(count.toString())).toFixed(2);
            }

            var avgSpan = jQuery('<span></span>');

            avgSpan.addClass('sub-section-title')

            avgSpan.text(avg);

            header.append(avgSpan);

        }

    }

}
