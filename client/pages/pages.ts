/**
 * Created by Sora on 11/28/2015.
 */
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, AfterViewInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {ROUTER_DIRECTIVES, RouteConfig, Route} from 'angular2/router';

import {
    ComponentInstruction,
    CanReuse,
    Location
} from 'angular2/router';

import {Item} from "./item/item";
import {Brand} from "./brand/brand";
import {Add} from "./add/add";

declare var Client:any;
declare var jQuery:any;

@Component({
    selector: 'pages',
})

@View({
    templateUrl: 'client/pages/pages.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

@RouteConfig([
    //{path: '/add', component: Add, as: 'Add'}
    {path: '/:type/:_id', component: Item, as: 'Item'},
    {path: '/brand/:_id', component: Brand, as: 'Brand'},
    {path: '/add', component: Add, as: 'Add'},
])

export class PagesPage implements CanReuse, AfterViewInit {

    location:Location;

    constructor(location:Location) {

        this.location = location;

        var reportDialog = jQuery('#report-dialog').modal({
            show: false,
            keyboard: false
        });

    }

    /*
     Defines route lifecycle method canReuse, which is called by the router to determine whether a component should be reused across routes, or whether to destroy and instantiate a new component.

     The canReuse hook is called with two ComponentInstructions as parameters, the first representing the current route being navigated to, and the second parameter representing the previous route.

     If canReuse returns or resolves to true, the component instance will be reused and the OnDeactivate hook will be run. If canReuse returns or resolves to false, a new component will be instantiated, and the existing component will be deactivated and removed as part of the navigation.

     If canReuse throws or rejects, the navigation will be cancelled.
     */
    routerCanReuse(next:ComponentInstruction, prev:ComponentInstruction) {
        return true;
    }

    ngAfterViewInit() {
        Client.NoFoodz.lib.scrollTop();
    }

}