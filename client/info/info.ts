/**
 * Created by Sora on 11/28/2015.
 */
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {ROUTER_DIRECTIVES, RouteConfig, Route} from 'angular2/router';

import {
    ComponentInstruction,
    CanReuse,
    Location
} from 'angular2/router';

import {About} from "./about/about";
import {ChangeLog} from "./changelog/changelog";
import {Faq} from "./faq/faq";
import {ForgotPassword} from "./forgotpassword/forgotpassword";

@Component({
    selector: 'info',
})

@View({
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

@RouteConfig([
    {path: '/about', component: About, name: 'About'},
    {path: '/changelog', component: ChangeLog, name: 'ChangeLog'},
    {path: '/faq', component: Faq, name: 'Faq'},
    {path: '/forgotpassword', component: ForgotPassword, name: 'ForgotPassword'}
])

export class InfoPage implements CanReuse {

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