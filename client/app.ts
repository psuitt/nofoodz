/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor, provide} from 'angular2/angular2';

import {bootstrap} from 'angular2-meteor';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {Home} from "client/home/home";
import {Wsie} from "./wsie/wsie";

@Component({
    selector: 'app'
})

@View({
    templateUrl: 'client/app.html',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    //{path: '/', redirectTo: '/home'},
    //{path: '/home', as: 'Home', component: Home},
    {path: '/', as: 'Home', component: Home},
    {path: '/wsie', as: 'Wsie', component: Wsie}
])

class MainLayout {

    numberOfUsers:string;

    constructor() {

        var variable = this.numberOfUsers;

        Meteor.call('getUserCount', function (err, response) {

            if (!err)
                variable = "Total Users " + response;

        });

        //$('.searchbar input').nofoodssearch();

    }

    onActivate() {
        return true;
    }

}

bootstrap(MainLayout, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue: '/'})]);