/**
 * Created by Sora on 11/23/2015.
 */
/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/angular2-meteor/angular2-meteor.d.ts" />

import {bootstrap} from 'angular2/platform/browser';

import {Component, View, provide, enableProdMode, AfterViewInit} from 'angular2/core';

import {RouterLink,
    ROUTER_DIRECTIVES,
    RouterOutlet,
    RouteConfig,
    Location,
    ROUTER_PROVIDERS,
    LocationStrategy,
    HashLocationStrategy,
    Router,
    Route,
    Redirect,
    APP_BASE_HREF,
    ComponentInstruction,
    CanReuse} from 'angular2/router';

import {FORM_DIRECTIVES} from 'angular2/common';

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
import {VerifyEmail} from "./verify-email/verify-email";
import {ResetPassword} from "./reset-password/reset-password";

declare var jQuery:any;
declare var _:any;
declare var Client:any;
declare var Meteor:any;
declare var Accounts:any;

@Component({
    selector: 'app'
})

@View({
    templateUrl: 'client/app.html',
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, RouterLink, RouterOutlet, MainLayout, UsersPage, Find]
})

@RouteConfig([
    new Redirect({path: '/home', redirectTo: ['/Home']}),
    {path: '/', name: 'Home', component: Home},
    {path: '/404', name: 'Error404', component: Error404},
    {path: '/wsie', name: 'Wsie', component: Wsie},
    {path: '/explore', name: 'Explore', component: Explore},
    {path: '/find/:type/:search', name: 'Find', component: Find},
    {path: '/users/...', name: 'Users', component: UsersPage},
    {path: '/pages/...', name: 'Pages', component: PagesPage},
    {path: '/top/...', name: 'Top', component: TopPage},
    {path: '/info/...', name: 'Info', component: InfoPage},
    {path: '/admin/...', name: 'Admin', component: AdminPage},
    {path: '/verify-email/:token', name: 'VerifyEmail', component: VerifyEmail},
    {path: '/reset-password/:token', name: 'ResetPassword', component: ResetPassword}
])

class MainLayout extends MeteorComponent implements CanReuse, AfterViewInit {

    router:Router;
    location:Location;

    userForm:{username:String, password: String} = {
        username: '',
        password: ''
    };
    registerForm:{username:String, email:String, password:String, confirmPassword:String};
    username:string;
    usernameShort:string;
    usernameRegex:RegExp = /^[0-9a-z_\.@\-~]{4,20}$/;

    constructor(router:Router, location:Location) {

        super();

        this.router = router;
        this.location = location;
        this.userForm = {
            username: '',
            password: ''
        };
        this.registerForm = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

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
            jQuery('#user_menu, #user_menu_icons').hide();
            jQuery('.username').text('Login');
        });

        jQuery(document).on('keypress', '#login_email, #login_password', function (evt) {
            if (evt.which === 13) {
                self.login();
            }
        });

        jQuery(document).on('keypress', '#register_username, #register_email, #register_password, #register_confirm_password', function (evt) {
            if (evt.which === 13) {
                self.register();
            }
        });

        // Hide listener
        jQuery(document).on('click', 'body', function (event) {
            //jQuery('#menu_close').click();

            if (jQuery(event.target).closest('.menu-secondary-nav').length === 0
                && jQuery(event.target).closest('.primary-nav').length === 0) {
                self.closeNav();
            }

        });

        jQuery(document).on('click', '#notifications', function (event) {

            self.loadNotifications();

        });

        jQuery(document).on('click', '.close-nav', this.closeAll);

        jQuery(document).on('click', '.has-children a', function (event) {

            var href = event.target.href,
                hrefSkip = false;

            if (href && href.length > 1) {
                href = href.substring(href.indexOf('#'));
                hrefSkip = href.length > 3;
            }

            if (jQuery(event.target).closest('ul').attr('id') == 'notificationsList'
                || hrefSkip) {
                self.closeNav();
                return;
            }

            event.preventDefault();

            var selected = jQuery(this);

            if (selected.next('ul').hasClass('is-hidden')) {
                //desktop version only
                selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
                selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
            } else {
                selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
            }

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
            if (this.href.indexOf('?') !== -1 || jQuery(this).attr('redirect') === 'true') {
                // manually redirect
                window.location = this.href;
            }

        });

        jQuery('#user_menu_icons .back').on('click', function () {
            jQuery('#user_menu_icons').removeClass('wide');
        });

    }

    closeNav() {

        jQuery('.has-children ul').addClass('is-hidden').removeClass('moves-out');
        jQuery('.has-children a').removeClass('selected');
        jQuery('#user_menu_icons').removeClass('wide');

    }

    closeAll(event) {

        event.preventDefault();
        jQuery('#menu-navbar').removeClass('in');
        jQuery('.has-children ul').addClass('is-hidden').removeClass('moves-out');
        jQuery('.has-children a').removeClass('selected');
        jQuery('#user_menu_icons').removeClass('wide');

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

        jQuery('#notificationsList').removeClass('is-hidden').html('');
        jQuery('#user_menu_icons').addClass('wide');

        if (jQuery('#usernameDisplay span.notification-flag').length > 0) {
            Meteor.call('readNotifications', function (err) {
                if (!err) {
                    jQuery('#usernameDisplay span.notification-flag, #usernameDisplaySub span.notification-flag').remove();
                }
            });
        }

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

    loadUserInfo() {

        var currentUser = this.call('userDataSimple', function (err, currentUser) {

            if (!err && currentUser) {

                if (!Client.NoFoodz.permissions.addAccess(currentUser)) {
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
                jQuery('#user_menu, #user_menu_icons').show();

                jQuery('#usernameDisplay, #usernameDisplaySub').text(this.username);

                if (currentUser.profile.isnotification) {
                    jQuery('#usernameDisplay, #usernameDisplaySub').prepend('<span class=\'notification-flag glyphicon glyphicon-bell\' title=\'Unread Notifications\'></span>');
                }

            } else {
                jQuery('#user_menu, #user_menu_icons').hide();
                jQuery('#login_menu, #register_menu').show();

                jQuery('.username').text('Login');
            }

        });

    }

    login() {

        // retrieve the input field values
        var errorText = jQuery('#login_error');

        errorText.text('');

        // Trim and validate your fields here....
        if (!this.userForm.username || this.userForm.username.trim().length === 0) {
            errorText.text('Username is required');
            return;
        }

        if (!this.userForm.password || this.userForm.password.length === 0) {
            errorText.text('Password is required');
            return;
        }

        // If validation passes, supply the appropriate fields to the
        Meteor.loginWithPassword(this.userForm.username.trim().toLocaleLowerCase(), this.userForm.password, (err) => {
            if (err) {
                // Inform the user that account creation failed
                errorText.text('Invalid login');
            } else {
                // Reset the form
                this.userForm = {
                    username: '',
                    password: ''
                };
                jQuery('#login_close').click();
                errorText.text('');
                this.loadUserInfo();
            }
        });

    }

    register() {

        var registerError = jQuery('#register_error');

        registerError.text('');

        if (!this.registerForm.username || this.registerForm.username.trim().length === 0) {
            registerError.text('Username is required');
            return;
        }
        if (!this.registerForm.email || this.registerForm.email.trim().length === 0) {
            registerError.text('Email is required');
            return;
        }
        if (!this.registerForm.password || this.registerForm.password.length === 0) {
            registerError.text('Password is required');
            return;
        }
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
            registerError.text('Passwords do not match');
            return;
        }

        var registerObj = {
            username: this.registerForm.username.trim(),
            email: this.registerForm.email.trim(),
            password: this.registerForm.password
        };

        Accounts.createUser(registerObj, (err, data) => {
            if (err) {
                // Inform the user that account creation failed
                registerError.text(err.reason);
            } else {
                jQuery('#login_close').click();
                registerError.text('');
                // Clear the form
                this.registerForm = {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                };
                this.loadUserInfo();
                Client.NoFoodz.alert.success('Account created successfully. Welcome to NoFoodz, ' + registerObj.username + '.');
            }

        });

    }

}

//enableProdMode();

bootstrap(MainLayout, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue: '/'}), provide(LocationStrategy, {useClass: HashLocationStrategy})]);
