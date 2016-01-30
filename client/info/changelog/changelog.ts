/**
 * Created by Sora on 12/15/2015.
 */
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, AfterViewInit} from 'angular2/core';

import {RouterLink} from 'angular2/router';

declare var _:any;
declare var jQuery:any;
declare var Client:any;
declare var Meteor:any;

@Component({
    selector: 'changelog'
})

@View({
    templateUrl: 'client/info/changelog/changelog.html',
    directives: [RouterLink]
})

export class ChangeLog implements AfterViewInit {

    constructor() {

    }

    ngAfterViewInit() {
        this.setup();
    }

    setup() {

        var cl = jQuery('#changelog');

        cl.html('');

        Meteor.call('getChangeLog', function (err, response) {

            if (!err && response) {

                _.each(response.changes, function (value, key) {

                    var h4 = jQuery('<h4></h4>');
                    var list = jQuery('<ul></ul>');

                    h4.text(Client.NoFoodz.lib.formatDate(value.date) + ' - ' + value.version);

                    cl.append(h4);

                    _.each(value.changes, function (change, index) {
                        var li = jQuery('<li></li>');
                        li.text(change);
                        list.append(li);
                    });

                    cl.append(list);

                });

            }

        });

    }

}
