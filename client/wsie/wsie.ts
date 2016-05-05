/**
 * Created by Sora on 11/23/2015.
 */
import {Component, OnDestroy} from 'angular2/core';

import {RouterLink} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

declare var Client:any;
declare var jQuery:any;

@Component({
    selector: 'wsie',
    templateUrl: 'client/wsie/wsie.html',
    directives: [Wsie, RouterLink]
})

export class Wsie extends MeteorComponent implements OnDestroy {

    query:Object;

    constructor() {
        super();
        this.query = Client.NoFoodz.lib.getParameters(true);
    }

    ngOnDestroy() {
    }

    doRandom() {

        var button = jQuery('#wsie_random');

        if (button.hasClass('loading')) {
            return;
        }

        var self = this;

        button.removeClass('glyphicon glyphicon-gift').addClass('loading');

        var obj = {
            type: Client.NoFoodz.consts.FOOD
        };

        if (this.query['brand_id']) {
            obj['brand_id'] = this.query['brand_id'];
        }

        this.call('getRandom', obj, function (err, response) {

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
            jQuery('#wsie_result').shuffleLetters({step: 25, text: name, callback: self.stop});
        };
        return func;
    }

    stop() {
        jQuery('#wsie_random').removeClass('loading').addClass('glyphicon glyphicon-gift');
    }

}