/**
 * Created by Sora on 11/30/2015.
 */
/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';

import {ROUTER_DIRECTIVES, RouteConfig, Route} from 'angular2/router';

import {
    ComponentInstruction,
    CanReuse,
    Location
} from 'angular2/router';

import {Gaming} from "./gaming/gaming";

@Component({
    selector: 'top',
})

@View({
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

@RouteConfig([
    {path: '/gaming', component: Gaming, as: 'Gaming'}
])

export class TopPage implements CanReuse {

    location:Location;

    constructor(location:Location) {
        this.location = location;
        window.scrollTo(0, 0);
    }

    getLinkStyle(path) {
        return this.location.path().indexOf(path) > -1;
    }

    canReuse(next:ComponentInstruction, prev:ComponentInstruction) {
        return false;
    }
}