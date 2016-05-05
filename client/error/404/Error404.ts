/**
 * Created by Sora on 11/28/2015.
 */
import {Component} from 'angular2/core';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'error404',
    templateUrl: 'client/error/404/Error404.html',
    directives: [RouterLink, ROUTER_DIRECTIVES]
})

export class Error404 {

}