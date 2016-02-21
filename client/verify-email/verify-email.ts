/**
 * Created by Sora on 2/20/2016.
 */
/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />
import {Component, View} from 'angular2/core';

import {MeteorComponent} from 'angular2-meteor';

declare var Accounts:any;

@Component({
    selector: 'verifyemail'
})

@View({
    templateUrl: 'client/verify-email/verify-email.html',
    directives: []
})
export class VerifyEmail extends MeteorComponent {

    constructor() {
        super();
        Accounts.onEmailVerificationLink(() => {
            alert('something');
        });
    }

}