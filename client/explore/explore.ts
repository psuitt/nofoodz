/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnInit} from 'angular2/core';

import {RouterLink} from 'angular2/router';

declare var jQuery:any;
declare var _:any;
declare var Client:any;
declare var NoFoodz:any;
declare var Meteor:any;

@Component({
    selector: 'home'
})

@View({
    templateUrl: 'client/explore/explore.html',
    directives: [Explore, RouterLink]
})

export class Explore implements OnInit {

    constructor() {

    }

    ngOnInit() {

        jQuery("#explore-worldmap").vectorMap({
            map: 'world_en',
            backgroundColor: '#a5bfdd',
            borderColor: '#818181',
            borderOpacity: 0.25,
            borderWidth: 1,
            color: '#f4f3f0',
            enableZoom: true,
            hoverColor: '#c9dfaf',
            hoverOpacity: null,
            normalizeFunction: 'linear',
            scaleColors: ['#b6d6ff', '#005ace'],
            selectedColor: '#c9dfaf',
            selectedRegion: null,
            showTooltip: true,
            onLabelShow: function (element, label, code) {

            },
            onRegionClick: function (element, code, region) {

            }
        });

        this.setup();

        jQuery('.explore-options button').eq(0).click();
    }

    setup() {

    }

    menuClick(event) {

        var self = jQuery(event.currentTarget),
            dataType = self.attr('datatype');

        var tempScrollTop = jQuery(window).scrollTop();

        jQuery('#explore-content').html('');
        jQuery('.explore-options button').removeClass('selected');
        self.addClass('selected');

        if (!dataType)
            return;

        var list = jQuery('<ol><ol>');

        Meteor.call('itemTopRatedSearch', {type: dataType}, function (err, response) {

            if (!err && response) {

                _.each(response, function (item, index) {

                    var listItem = jQuery("<li></li>");
                    var div = jQuery("<div class='myrating myfoods'></div>");
                    var title = jQuery("<span class='name item-color myfoods'><a></a></span>");
                    var brand = jQuery("<span class='brand brand-color myfoods'><a></a></span>");

                    title.addClass("lower");

                    div.append(title);
                    div.append(brand);

                    var avg = NoFoodz.format.calculateAverageDisplay(item);

                    div.append(Client.NoFoodz.widgetlib.createHeart(avg, item.ratingcount_calc));

                    title.find('a').attr('href', Client.NoFoodz.consts.urls[dataType.toUpperCase()] + item._id).html(item.name);
                    brand.find('a').attr('href', Client.NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);

                    listItem.append(div);
                    list.append(listItem);

                });

            }

            jQuery('#explore-content').append(list);

            jQuery(window).scrollTop(tempScrollTop);

            jQuery('[data-toggle=\'tooltip\']').tooltip();

        });

    }

}