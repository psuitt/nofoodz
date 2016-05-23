/**
 * Created by Sora on 5/5/2016.
 */
/**
 * Created by Sora on 11/30/2015.
 */
import 'ng2-material/all.webpack';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {Component, AfterViewInit} from 'angular2/core';
import {MeteorComponent} from 'angular2-meteor';

import {RouterLink, Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

declare var jQuery:any;
declare var Client:any;
declare var NoFoodz:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'food',
    templateUrl: 'client/top/food/food.html',
    directives: [RouterLink, ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES]
})

export class Food extends MeteorComponent implements AfterViewInit {

    title:string;
    screenData:any;
    brands:any;

    constructor(private router:Router, params:RouteParams) {
        super();
        this.screenData = Client.NoFoodz.lib.getParameters(true);
        this.init();
    }

    init() {
        if (this.screenData.title) {
            this.title = Client.NoFoodz.format.camelCase(this.screenData.title);
        }
    }

    ngAfterViewInit() {
        
        this.loadItems(this.screenData);

    }

    loadItems(query) {

        var typeUpper = query.type.toUpperCase(),
            obj = {
                tags: query.tags.split(','),
                type: query.type,
                city: query.city
            };

        this.autorun(() => {
            this.call('itemTagSearch', obj, (err, data) => {
                this.brands = data;
            });
        });

    }

    filterResults(filter) {
        
    }

}