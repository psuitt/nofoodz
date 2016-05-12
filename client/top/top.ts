/**
 * Created by Sora on 11/30/2015.
 */
import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {ROUTER_DIRECTIVES, RouteConfig, Route} from 'angular2/router';

import {
    ComponentInstruction,
    CanReuse,
    Location
} from 'angular2/router';

import {Gaming} from "./gaming/gaming";
import {Food} from "./food/food";

@Component({
    selector: 'top',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

@RouteConfig([
    {path: '/gaming', component: Gaming, as: 'Gaming'},
    {path: '/food', component: Food, as: 'Food'}
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

    routerCanReuse(next:ComponentInstruction, prev:ComponentInstruction) {
        return false;
    }
}