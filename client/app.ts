/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor, provide} from 'angular2/angular2';

import {bootstrap} from 'angular2-meteor';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {Home} from "client/home/home";
import {Wsie} from "./wsie/wsie";
import {Explore} from "./explore/explore";
import {Find} from "./find/find";

declare var jQuery:any;
declare var NoFoodz:any;

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
    {path: '/wsie', as: 'Wsie', component: Wsie},
    {path: '/explore', as: 'Explore', component: Explore},
    {path: 'find/:type/:search', as: 'Find', component: Find}
])

class MainLayout {

    username:string;
    usernameShort:string;

    constructor() {

        Meteor.call('getUserCount', function (err, response) {

            if (!err)
                jQuery('#totalusers').text('Total Users ' + response);

        });

        jQuery('.searchbar input').nofoodssearch();

        jQuery('#menu [data-toggle=\'dropdown\']').dropdown();

        jQuery('#logout_button').on('click', function () {
            Meteor.logout(function (err) {
                // TODO - Do something if there is an error.
            });
            jQuery('#login_menu, #register_menu').show();
            jQuery('#user_menu').hide();
            jQuery('.username').text('Login');
        });

        this.loadUserInfo();

    }

    onActivate() {
        return true;
    }

    loadUserInfo() {

        var currentUser = Meteor.call('userDataSimple', function (err, currentUser) {

            if (!err && currentUser) {

                if (!NoFoodz.client.permissions.addAccess(currentUser)) {
                    jQuery('#menu_addbutton').hide();
                }

                if (currentUser.profile.name) {
                    this.username = currentUser.profile.name;
                } else {
                    this.username =
                        currentUser.username.substring(0, 1).toUpperCase() + currentUser.username.substring(1);
                }

                this.usernameShort = currentUser.username.substring(0, 2).toUpperCase();

                jQuery('#login_menu, #register_menu').hide();

                jQuery('.username').text(this.username);

            } else {
                jQuery('#user_menu').hide();
            }

        });

    }

}

bootstrap(MainLayout, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue: '/'})]);