/**
 * Created by Sora on 11/29/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;

@Component({
    selector: 'brand'
})

@View({
    templateUrl: 'client/pages/brand/brand.html',
    directives: [NgFor, RouterLink, ROUTER_DIRECTIVES]
})

export class Brand {

    screenData:any;

    constructor(private router:Router, params:RouteParams) {

        this.screenData = {
            _id: params.get('_id')
        };

        this.setup();
        this.loadListeners();

    }

    onDestroy() {

        jQuery(document).off('click', '#brands-nav a');

    }

    setup() {
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

        Meteor.call('getAllByBrand', obj, function (err, data) {

            if (!err) {

                var brand = data.brand;

                if (!brand)
                    self.router.navigate(['/Error404']);

                jQuery('.brand-name').html(brand.name);

                if (brand.flags && brand.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1)
                    jQuery('.button.report').addClass('reported')
                        .html('Reported')
                        .attr('title', 'This item has been reported.');

                self.loadItems(data.foods, NoFoodz.consts.FOOD);
                self.loadItems(data.drinks, NoFoodz.consts.DRINK);
                self.loadItems(data.products, NoFoodz.consts.PRODUCT);


            }

        });

    }

    loadItems(items, type) {

        var avg = '0';

        jQuery('#brand_list' + type).text('');
        jQuery('#brand_totalrating' + type).text('');

        if (items && items.length > 0) {

            var total = 0;
            var count = 0;

            _.each(items, function (item, index) {

                var div = jQuery('<div></div>'),
                    link = jQuery('<a></a>');

                link.addClass('item-color');
                link.attr('href', NoFoodz.consts.urls[type.toUpperCase()] + item._id).html(item.name);

                div.append(link);

                jQuery('#brand_list' + type).append(div);
                total += parseInt(item.ratingtotal_calc, 10);
                count += parseInt(item.ratingcount_calc, 10);

            });

            if (total > 0) {
                avg = (total / parseFloat(count.toString())).toFixed(2);
            }

            jQuery('#brand_totalrating' + type).text(avg);

        } else {
            // Hide the parent list item.
            jQuery('#brand_totalrating' + type).hide();
            jQuery('label[for=\'brand_totalrating' + type + '\']').hide();
            jQuery('[href=\'#brand_' + type + '\']').parent().hide();
        }

    }
}