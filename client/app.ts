/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor, provide} from 'angular2/angular2';

import {bootstrap} from 'angular2-meteor';

import {ROUTER_DIRECTIVES, RouteConfig, Location,ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy, Route, AsyncRoute, Router, APP_BASE_HREF} from 'angular2/router';

import {Home} from "client/home/home";
import {Wsie} from "./wsie/wsie";
import {Explore} from "./explore/explore";
import {Find} from "./find/find";
import {UsersPage} from "./users/users";

declare var jQuery:any;
declare var NoFoodz:any;

declare var System:any;

@Component({
    selector: 'app',
    templateUrl: 'client/app.html',
    directives: [UsersPage, Find, ROUTER_DIRECTIVES]
})

@RouteConfig([
    //{path: '/', redirectTo: '/home'},
    {path: '/', component: Home, as: 'Home'},
    {path: '/wsie', component: Wsie, as: 'Wsie'},
    {path: '/explore', component: Explore, as: 'Explore'},
    {path: '/find/:type/:search', component: Find, as: 'Find'},
    {path: '/users/...', component: UsersPage, as: 'Users'}
])

class MainLayout {

    router:Router;
    location:Location;

    username:string;
    usernameShort:string;

    constructor(router:Router, location:Location) {

        this.router = router;
        this.location = location;

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

        jQuery(document).on('submit', '#login_form', this.createSubmitLogin());

        jQuery(document).on('keypress', '#login_email, #login_password', function (evt) {
            if (evt.which === 13) {
                jQuery('#login_form').submit();
            }
        });

        jQuery(document).on('click', 'login_button', function () {
            jQuery('#login_form').submit();
        });

        jQuery(document).on('submit', '#register_form', this.createSubmitRegister());

        jQuery(document).on('keypress', '#register_username, #register_email, #register_password, #register_confirm_password', function (evt) {
            if (evt.which === 13) {
                jQuery('#register_form').submit();
            }
        });

        jQuery(document).on('click', 'register_account', function () {
            jQuery('#register_form').submit();
        });

        this.loadUserInfo();

    }

    getLinkStyle(path) {

        if (path === this.location.path()) {
            return true;
        }
        else if (path.length > 0) {
            return this.location.path().indexOf(path) > -1;
        }
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
                jQuery('#user_menu').show();

                jQuery('.username').text(this.username);

            } else {
                jQuery('#user_menu').hide();
                jQuery('#login_menu, #register_menu').show();

                jQuery('.username').text('Login');
            }

        });

    }

    createSubmitLogin() {

        var self = this;

        return function (error) {

            // retrieve the input field values
            var email = jQuery('#login_email').val().toLocaleLowerCase(),
                password = jQuery('#login_password').val();

            // Trim and validate your fields here....

            // If validation passes, supply the appropriate fields to the
            // Meteor.loginWithPassword() function.
            Meteor.loginWithPassword(email, password, function (err) {
                if (err) {
                    // Inform the user that account creation failed
                    jQuery('#login_form .error-message').text('Invalid login');
                } else {
                    jQuery('#login_close').click();
                    jQuery('#login_form .error-message').text('');
                    self.loadUserInfo();
                }
            });

        }

    }

    createSubmitRegister() {

        var self = this;

        return function (error) {

            var username = jQuery('#register_username').val(),
                email = jQuery('#register_email').val(),
                password = jQuery('#register_password').val(),
                confirmPassword = jQuery('#register_confirm_password').val();

            if (password !== confirmPassword) {
                jQuery('.error-message').text('Passwords do not match');
            } else {

                // Trim and validate the input
                Accounts.createUser({username: username, email: email, password: password}, function (err, data) {
                    if (err) {
                        // Inform the user that account creation failed
                        jQuery('#register_form .error-message').text(err.reason);
                    } else {
                        jQuery('#login_close').click();
                        jQuery('#register_form .error-message').text('');
                        self.loadUserInfo();
                    }

                });

            }

        };

    }

}

class ComponentHelper {

    static LoadComponentAsync(name, path) {
        return System.import(path).then(c => c[name]);
    }
}

bootstrap(MainLayout, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue: '/'}), provide(LocationStrategy, {useClass: HashLocationStrategy})]);