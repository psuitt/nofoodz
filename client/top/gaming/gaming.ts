/**
 * Created by Sora on 11/30/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;

@Component({
    selector: 'gaming'
})

@View({
    templateUrl: 'client/top/gaming/gaming.html',
    directives: [NgFor, RouterLink, ROUTER_DIRECTIVES]
})

export class Gaming {

    screenData:any;

    constructor(private router:Router, params:RouteParams) {

        //jQuery('span.pagetitle-subtext').text(NoFoodz.format.camelCase(screenData.query.title));
        //loadItems(screenData.query);

        this.setup();
        this.loadListeners();

    }

    setup() {

    }

    loadListeners() {

    }

    loadItems(query) {

        var typeUpper = query.type.toUpperCase();

        Meteor.call('itemTagSearch', {tags: query.tags.split(','), type: query.type}, function (err, response) {

            if (!err && response) {

                var list = jQuery('#gaming_list');

                _.each(response, function (item, index) {

                    var listItem = jQuery('<li></li>');
                    var div = jQuery('<div class=\'myrating myfoods\'></div>');

                    var title = jQuery('<span class=\'name item-color myfoods\'><a></a></span>');

                    var brand = jQuery('<span class=\'brand brand-color myfoods\'><a></a></span>');
                    brand.find('a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);

                    title.addClass('lower');

                    div.append(title);
                    div.append(brand);

                    var avg = NoFoodz.format.calculateAverageDisplay(item);

                    div.append(Client.NoFoodz.widgetlib.createHeart(avg, item.ratingcount_calc));

                    title.find('a').attr('href', NoFoodz.consts.urls[typeUpper] + item._id).html(item.name);


                    listItem.append(div);
                    list.append(listItem);

                });

            }

            jQuery('[data-toggle=\'tooltip\']').tooltip();

        });

    }

}