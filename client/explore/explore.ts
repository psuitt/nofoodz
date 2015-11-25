/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink} from 'angular2/router';

declare var jQuery:any;

@Component({
    selector: 'home'
})

@View({
    templateUrl: 'client/explore/explore.html',
    directives: [NgFor, RouterLink]
})

export class Explore {

    constructor() {

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

        jQuery('.explore-options button').eq(0).click();

    }
}