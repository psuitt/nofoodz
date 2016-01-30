/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnDestroy} from 'angular2/core';

import {NgFor} from 'angular2/common';

import {RouterLink, Router, RouterOutlet} from 'angular2/router';

declare var NoFoodz:any;
declare var Client:any;
declare var jQuery:any;
declare var _:any;

@Component({
    selector: 'home'
})

@View({
    templateUrl: 'client/home/home.html',
    directives: [NgFor, RouterLink, RouterOutlet]
})

export class Home implements OnDestroy {

    types:Array<String>;

    constructor(private router:Router) {

        var types = [];

        _.each(Client.NoFoodz.consts.types, function (value, key) {
            types.push(NoFoodz.format.camelCase(value));
        });

        this.types = types;

        jQuery('#login .logo').hide();
        jQuery('#login .searchbar').hide();

        jQuery('#mainContent').addClass('white');
        jQuery('#header').addClass('hidden');

        jQuery('#mainContent [data-toggle=\'dropdown\']').dropdown();

        var func = this.doSearch,
            router = this.router;

        jQuery(document).on('click', '#home-searchgo', function (event) {
            func(router, jQuery('#home-search').val());
        });

        jQuery(document).on('keypress', '#home-search', function (event) {
            if (event.which == 13) {
                func(router, event.target.value);
            }
        });

        jQuery(document).on('click', '#home-searchtype ul li a', function (event) {
            jQuery('#home-searchtype .home-searchval').html(event.target.innerHTML)
        });

    }

    ngOnDestroy() {
        jQuery('#mainContent').removeClass('white');
        jQuery('#header').removeClass('hidden');
        jQuery('#login .logo').show();
        jQuery('#login .searchbar').show();
    }

    doSearch(router, searchVal) {
        var type = jQuery('#home-searchtype .home-searchval').html().toLowerCase();
        if (type) {
            router.navigate(['/Find', {type: type, search: searchVal}]);
        }
    }

}