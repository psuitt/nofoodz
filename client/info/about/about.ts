/**
 * Created by Sora on 12/11/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink} from 'angular2/router';

@Component({
    selector: 'about'
})

@View({
    templateUrl: 'client/info/about/about.html',
    directives: [RouterLink]
})

export class About {

    constructor() {

    }

}