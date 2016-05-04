/**
 * Created by Sora on 2/20/2016.
 */
/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />
import {Component, View, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

declare var Client:any;
declare var Meteor:any;
declare var Accounts:any;

@Component({
    selector: 'verifyemail'
})

@View({
    templateUrl: 'client/verify-email/verify-email.html',
    directives: []
})
export class VerifyEmail extends MeteorComponent implements OnInit {

    token:String;
    router:Router;

    constructor(params:RouteParams, router:Router) {
        super();
        this.token = params.get('token');
        this.router = router;
    }

    ngOnInit() {

        Accounts.verifyEmail(this.token, (error) => {
            if (!error) {
                // This logs in so log out.
                Meteor.logout(function (err) {
                    // TODO - Do something if there is an error.
                });
                this.router.navigate(['/Home']);
                Client.NoFoodz.alert.success('Verification successful!');
            } else {
                this.router.navigate(['/Error404']);
                Client.NoFoodz.alert.error('Verification failed.');
            }
        });
    }

}