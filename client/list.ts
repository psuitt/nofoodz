/**
 * Created by Sora on 12/22/2015.
 */
import {Component, Inject} from 'angular2/core';

import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

declare var Client:any;
declare var jQuery:any;

@Component({
    selector: "list",
    templateUrl: "client/list.html",
    directives: [List, ROUTER_DIRECTIVES]
})

export class List {

    screenData:any;
    currentItems:Array<String> = [];

    constructor() {
        //this.screenData = params;

        jQuery('.list-add-button').attr({
            'item-id': '',
            'item-type': '',
            'item-name': ''
        }).hide();

    }

    toggleList(event) {

        var list = jQuery(event.target).closest('.list');

        list.toggleClass('closed');

        return false;
    }

    addItem(event) {

        var list = jQuery(event.target).closest('.list');
        var listAddButton = list.find('.list-add-button');
        var type = listAddButton.attr('item-type');
        var id = listAddButton.attr('item-id');
        var name = listAddButton.attr('item-name');

        if (this.currentItems.indexOf(type + id) !== -1) {
            // Do nothing.
            return;
        }

        var ul = jQuery(event.target).parent().find('.list-display');
        var li = jQuery('<li></li>');
        var a = jQuery('<a></a>');

        a.attr('href', Client.NoFoodz.consts.urls[type.toUpperCase()] + id);

        a.text(name);

        li.append(a);

        ul.append(li);

        this.currentItems.push(type + id);

        list.find('.list-count').text('(' + this.currentItems.length + ')');

    }

    save(event) {


    }

}
