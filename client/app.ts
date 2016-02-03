/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/angular2-meteor/angular2-meteor.d.ts" />

import {bootstrap} from 'angular2/platform/browser';

import {Component, View, provide, enableProdMode, AfterViewInit} from 'angular2/core';

import {RouterLink, ROUTER_DIRECTIVES, RouterOutlet, RouteConfig, Location, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy, Route, AsyncRoute, Router, APP_BASE_HREF} from 'angular2/router';

import { ComponentInstruction, CanReuse } from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {Error404} from "./error/404/Error404";

import {Home} from "client/home/home";
import {Wsie} from "./wsie/wsie";
import {Explore} from "./explore/explore";
import {Find} from "./find/find";

import {UsersPage} from "./users/users";
import {PagesPage} from "./pages/pages";
import {TopPage} from "./top/top";
import {AdminPage} from "./admin/admin";
import {InfoPage} from "./info/info";
import {List} from "./list";

declare var jQuery:any;
declare var NoFoodz:any;
declare var _:any;
declare var Client:any;
declare var Meteor:any;
declare var Accounts:any;

declare var System:any;

@Component({
    selector: 'app',
    templateUrl: 'client/app.html',
    directives: [UsersPage, Find, ROUTER_DIRECTIVES, RouterLink, RouterOutlet]
})

@RouteConfig([
    //{path: '/', redirectTo: '/home'},
    {path: '/', component: Home, as: 'Home'},
    {path: '/404', component: Error404, as: 'Error404'},
    {path: '/wsie', component: Wsie, as: 'Wsie'},
    {path: '/explore', component: Explore, as: 'Explore'},
    {path: '/find/:type/:search', component: Find, as: 'Find'},
    {path: '/users/...', component: UsersPage, as: 'Users'},
    {path: '/pages/...', component: PagesPage, as: 'Pages'},
    {path: '/top/...', component: TopPage, as: 'Top'},
    {path: '/info/...', component: InfoPage, as: 'Info'},
    {path: '/admin/...', component: AdminPage, as: 'Admin'}
])

class MainLayout extends MeteorComponent implements CanReuse, AfterViewInit {

    router:Router;
    location:Location;

    username:string;
    usernameShort:string;

    constructor(router:Router, location:Location) {

        super();

        this.router = router;
        this.location = location;

        window.scrollTo(0, 0);

    }

    /*
     Defines route lifecycle method canReuse, which is called by the router to determine whether a component should be reused across routes, or whether to destroy and instantiate a new component.

     The canReuse hook is called with two ComponentInstructions as parameters, the first representing the current route being navigated to, and the second parameter representing the previous route.

     If canReuse returns or resolves to true, the component instance will be reused and the OnDeactivate hook will be run. If canReuse returns or resolves to false, a new component will be instantiated, and the existing component will be deactivated and removed as part of the navigation.

     If canReuse throws or rejects, the navigation will be cancelled.
     */
    routerCanReuse(next:ComponentInstruction, prev:ComponentInstruction) {
        if (next.reuse) {

        }
        return false;
    }

    ngAfterViewInit() {

        this.call('getUserCount', function (err, response) {

            if (!err)
                jQuery('#totalusers').text('Total Users ' + response);

        });

        this.loadListeners(this.router);

        this.loadUserInfo();

    }

    loadListeners(router) {

        var self = this;

        jQuery('.searchbar input').nofoodssearch({router: router});

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

        // Hide listener
        jQuery(document).on('click', 'body', function (e) {
            //jQuery('#menu_close').click();
            if (jQuery(e.target).closest('#notificationsList').length === 0
                && jQuery(e.target).closest('#notifications').length === 0
                && jQuery('#notifications').hasClass('open')) {
                jQuery('#notifications').removeClass('open');
                jQuery('#notificationsList').removeClass('open');
            }

            if (jQuery(e.target).closest('.menu-secondary-nav').length === 0
                && jQuery(e.target).closest('.primary-nav').length === 0) {
                self.closeNav();
            }

        });

        jQuery(document).on('click', '#notifications', function (event) {

            event.stopPropagation();

            if (!jQuery(this).hasClass('open')) {
                jQuery(this).addClass('open');
                jQuery('#notificationsList').html('').addClass('open');
                self.loadNotifications();
            } else {
                jQuery(this).removeClass('open');
                jQuery('#notificationsList').removeClass('open');
            }

        });

        jQuery(document).on('click', '.close-nav', this.closeAll);

        jQuery(document).on('click', '.has-children a', function (event) {
            event.preventDefault();

            var selected = jQuery(this);

            if (selected.next('ul').hasClass('is-hidden')) {
                //desktop version only
                selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
                selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
            } else {
                selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
            }
            //toggleSearch('close');
        });

        jQuery(document).on('click', '.back', function () {
            jQuery(this).parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
        });

        jQuery(document).on('click', '#menu_searchbutton', function () {
            jQuery('#header_searchdiv').toggleClass('is-visible');
        });

        jQuery(document).on('click', '.menu-secondary-nav .menu-link', function (event) {
            if (this.href[this.href.length - 1] !== '#') {
                self.closeAll(event);
            } else if (self.isNotMobile() && this.className.indexOf('menu-header') !== -1) {
                event.preventDefault();
                return false;
            }
            if (this.href.indexOf('?') !== -1) {
                // manually redirect
                window.location = this.href;
            }

        });

    }

    closeNav() {
        //jQuery('.cd-nav-trigger').removeClass('nav-is-visible');
        // jQuery('.cd-main-header').removeClass('nav-is-visible');
        //jQuery('.cd-primary-nav').removeClass('nav-is-visible');
        jQuery('.has-children ul').addClass('is-hidden').removeClass('moves-out');
        jQuery('.has-children a').removeClass('selected');
        //jQuery('.moves-out').removeClass('moves-out');
        //jQuery('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        //    jQuery('body').removeClass('overflow-hidden');
        //});
    }

    closeAll(event) {

        event.preventDefault();
        jQuery('#menu-navbar').removeClass('in');
        jQuery('.has-children ul').addClass('is-hidden').removeClass('moves-out');
        jQuery('.has-children a').removeClass('selected');

    }

    isNotMobile() {

        //check window width (scrollbar included)
        var e:any = window,
            a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return (e[a + 'Width'] >= 767);

    }

    loadNotifications() {

        var li = jQuery('<li class=\'title\'></li>');
        li.html("Notifications");
        jQuery('#notificationsList').append(li);

        Meteor.call('getUserNotifications', function (err, data) {

            if (!err) {

                if (data && data.length > 0) {

                    _.each(data.reverse(), function (notification, index, list) {
                        if (notification.message) {
                            var li = jQuery('<li></li>'),
                                span = jQuery('<span></span>');

                            li.html(notification.message);
                            span.html(Client.NoFoodz.lib.formatDate(notification.date));

                            li.prepend(span);
                            jQuery('#notificationsList').append(li);
                        }
                    });

                } else {
                    var li = jQuery('<li></li>');
                    li.html("No notifications available");
                    jQuery('#notificationsList').append(li);
                }

            } else {
                var li = jQuery('<li></li>');
                li.html(err);
                jQuery('#notificationsList').append(li);
            }

        });

    }

    getLinkStyle(path) {

        if (path === this.location.path()) {
            return true;
        }
        else if (path.length > 0) {
            return this.location.path().indexOf(path) > -1;
        }
    }

    loadUserInfo() {

        var currentUser = this.call('userDataSimple', function (err, currentUser) {

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

//enableProdMode();

bootstrap(MainLayout, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue: '/'}), provide(LocationStrategy, {useClass: HashLocationStrategy})]);
