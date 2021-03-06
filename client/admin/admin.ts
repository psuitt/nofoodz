/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {ROUTER_DIRECTIVES, RouteConfig, Route, RouterLink} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {ComponentInstruction, CanReuse, Router} from 'angular2/router';

import {Reported} from "./reported/reported";

declare var Meteor:any;
declare var Client:any;
declare var jQuery:any;

@Component({
    selector: 'admin',
})

@View({
    templateUrl: 'client/admin/admin.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, RouterLink]
})

@RouteConfig([
    {path: '/reported', component: Reported, as: 'Reported'}
])

export class AdminPage extends MeteorComponent implements CanReuse {

    location:Location;

    constructor(private router:Router) {
        super();

        this.location = location;

        if (!Meteor.userId()) {
            this.router.navigate(['/Error404']);
            return;
        }

        this.call('userDataSimple', function (err, currentUser) {

            if (err || !Client.NoFoodz.permissions.isAdmin(currentUser)) {

                this.router.navigate(['/Error404']);

            }

        });
    }

    /*
     Defines route lifecycle method canReuse, which is called by the router to determine whether a component should be reused across routes, or whether to destroy and instantiate a new component.

     The canReuse hook is called with two ComponentInstructions as parameters, the first representing the current route being navigated to, and the second parameter representing the previous route.

     If canReuse returns or resolves to true, the component instance will be reused and the OnDeactivate hook will be run. If canReuse returns or resolves to false, a new component will be instantiated, and the existing component will be deactivated and removed as part of the navigation.

     If canReuse throws or rejects, the navigation will be cancelled.
     */
    routerCanReuse(next:ComponentInstruction, prev:ComponentInstruction) {
        return false;
    }

}