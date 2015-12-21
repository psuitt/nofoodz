/**
 * Created by Sora on 11/28/2015.
 */
/// <reference path="../../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'error404'
})

@View({
    templateUrl: 'client/error/404/Error404.html',
    directives: [RouterLink, ROUTER_DIRECTIVES]
})

export class Error404 {

}