/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, OnDestroy} from 'angular2/core';

import {RouterLink} from 'angular2/router';

declare var NoFoodz:any;
declare var jQuery:any;

@Component({
    selector: 'wsie'
})

@View({
    templateUrl: 'client/wsie/wsie.html',
    directives: [Wsie, RouterLink]
})

export class Wsie implements OnDestroy {

    ngOnDestroy() {
        jQuery('#wsie_random').off();
    }

    doRandom() {

        var self = this;

        jQuery('#wsie_random').off('click').removeClass('glyphicon glyphicon-gift').addClass('loading');

        Meteor.call('getRandom', {type: NoFoodz.consts.FOOD}, function (err, response) {

            if (!err) {
                if (response.rating) {
                    jQuery('#wsie_resultbrand').shuffleLetters({
                        step: 25,
                        text: response.item.brand_view,
                        callback: self.startItem(response.item.name)
                    });

                } else {
                    jQuery('#wsie_result').text('Please rate more things to use this feature');
                }
            } else {
                jQuery('#wsie_result').text(err.reason);
            }

        });

    }

    startItem(name) {
        var self = this;
        var func = function () {
            jQuery('#wsie_result').shuffleLetters({step: 25, text: name, callback: self.addListener});
        };
        return func;
    }

    addListener() {
        jQuery('#wsie_random').on('click', this.doRandom).removeClass('loading').addClass('glyphicon glyphicon-gift');
    }

}