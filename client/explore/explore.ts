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

        var div = jQuery('<div></div>');

        Meteor.call('itemTopRatedSearch', {type: dataType}, function (err, response) {

            if (!err && response) {

                _.each(response, function (item, index) {

                    div.append(Client.NoFoodz.widgetlib.createDisplay(item, dataType, true, index + 1));

                });

            }

            jQuery('#explore-content').append(div);

            jQuery(window).scrollTop(tempScrollTop);

        });

    }

}