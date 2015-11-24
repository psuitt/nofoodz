/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {RouterLink} from 'angular2/router';

@Component({
    selector: 'home'
})

@View({
    templateUrl: 'client/home/home.html',
    directives: [NgFor, RouterLink]
})

export class Home {
}