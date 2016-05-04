/**
 * Created by Sora on 2/22/2016.
 */
/**
 * Created by Sora on 2/20/2016.
 */
/// <reference path="../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

declare var Client:any;
declare var Meteor:any;
declare var Accounts:any;

@Component({
    selector: 'forgotpassword'
})

@View({
    templateUrl: 'client/info/forgotpassword/forgotpassword.html',
    directives: [FORM_DIRECTIVES, ForgotPassword]
})
export class ForgotPassword extends MeteorComponent {

    router:Router;
    email:String;
    hideResetButton:boolean = false;

    constructor(router:Router) {
        super();
        this.router = router;
    }

    reset() {
        this.hideResetButton = true;
        Accounts.forgotPassword({email: this.email}, (error) => {
            if (!error) {
                this.hideResetButton = false;
            }
        });
    }

}