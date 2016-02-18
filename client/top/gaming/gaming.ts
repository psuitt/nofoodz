/**
 * Created by Sora on 11/30/2015.
 */
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, AfterViewInit} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'gaming'
})

@View({
    templateUrl: 'client/top/gaming/gaming.html',
    directives: [RouterLink, ROUTER_DIRECTIVES]
})

export class Gaming implements AfterViewInit {

    screenData:any;

    constructor(private router:Router, params:RouteParams) {

        this.screenData = Client.NoFoodz.lib.getParameters(true);

    }

    ngAfterViewInit() {

        this.screenData.title && jQuery('span.pagetitle-subtext').text(Client.NoFoodz.format.camelCase(this.screenData.title));
        this.loadItems(this.screenData);

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

                var div = jQuery('#gaming_list').html('');

                _.each(response, function (item, index) {

                    div.append(Client.NoFoodz.widgetlib.createDisplay(item, query.type, true));

                });

            }

        });

    }

}