/**
 * Created by Sora on 11/28/2015.
 */
/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {ROUTER_DIRECTIVES, RouteConfig, Route} from 'angular2/router';

import {
    ComponentInstruction,
    CanReuse,
    Location
} from 'angular2/router';

import {MyFoods} from "./profile/myfoods";
import {People} from "./people/people";

@Component({
    selector: 'users',
})

@View({
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, MyFoods]
})

@RouteConfig([
    {path: '/myfoods', component: MyFoods, as: 'MyFoods'},
    {path: '/people/:username', component: People, as: 'People'}
])

export class UsersPage implements CanReuse {

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