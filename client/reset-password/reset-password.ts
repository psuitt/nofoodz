/**
 * Created by Sora on 2/20/2016.
 */
/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />
import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {RouteParams, Router} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

declare var Client:any;
declare var Meteor:any;
declare var Accounts:any;
declare var jQuery:any;

@Component({
    selector: 'resetpassword'
})

@View({
    templateUrl: 'client/reset-password/reset-password.html',
    directives: [FORM_DIRECTIVES, ResetPassword]
})
export class ResetPassword extends MeteorComponent {

    token:String;
    router:Router;
    newPassword:String;
    confirmNewPassword:String;

    constructor(params:RouteParams, router:Router) {
        super();
        this.token = params.get('token');
        this.router = router;
    }

    reset() {

        var errorText = jQuery('#resetpassword_error');

        if (!this.newPassword || this.newPassword.length === 0) {
            errorText.text('A new password is required');
            return;
        }

        if (this.newPassword !== this.confirmNewPassword) {
            errorText.text('Passwords do not match');
            return;
        }

        Accounts.resetPassword(this.token, this.newPassword, (error) => {
            if (!error) {
                this.router.navigate(['/Home']);
                Client.NoFoodz.alert.success('Password updated!');
            } else {
                this.router.navigate(['/Error404']);
                Client.NoFoodz.alert.error('Password update failed.');
            }
        });
    }

}