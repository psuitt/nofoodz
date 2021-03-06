/**
 * Created by Sora on 11/30/2015.
 */
/// <reference path="../../../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, OnDestroy, AfterViewInit} from 'angular2/core';

import {RouterLink, Router, RouteParams, Location, ROUTER_DIRECTIVES} from 'angular2/router';

declare var window:any;
declare var jQuery:any;
declare var Client:any;
declare var _:any;
declare var Meteor:any;

@Component({
    selector: 'add'
})

@View({
    templateUrl: 'client/pages/add/add.html',
    directives: [Add, RouterLink, ROUTER_DIRECTIVES]
})

export class Add implements OnDestroy, AfterViewInit {

    location:Location;

    screenData:any;
    nofoodsRating:any;

    constructor(private router:Router, params:RouteParams, location:Location) {

        this.screenData = Client.NoFoodz.lib.getParameters(true);

    }

    ngOnDestroy() {

        jQuery(document).off('click', '.foodsadd-group .foodsadd-add-item');

        jQuery(document).off('click', '.foodsadd-brand-remove');

        jQuery(document).off('click', '.foodsadd-remove');

        this.nofoodsRating.remove();

    }

    ngAfterViewInit() {
        this.setup();
        this.loadListeners();
        window.scrollTo(0, 0);
    }

    setup() {

        if (!Meteor.userId()) {
            this.router.navigate(['/Home']);
            return;
        }

        Meteor.call('userDataSimple', function (err, currentUser) {

            if (!err) {

                if (Client.NoFoodz.permissions.createMultiple(currentUser))
                    jQuery('#foodsadd_numberselect').removeClass('hide');

            }

        });

        this.nofoodsRating = jQuery('div.ratingDiv').nofoodsrating();

        if (this.screenData && this.screenData.brand_id) {

            var obj = {
                brand_id: this.screenData.brand_id
            };
            Meteor.call('getBrand', obj, function (err, data) {

                if (!err) {

                    var brand = data.brand;

                    if (brand) {
                        jQuery('#foodsadd_brand').attr("disabled", "disabled").val(brand.name).data('brand_id', brand._id);
                    }

                }

            });

        }

    }

    loadListeners() {

        var self = this;

        jQuery(document).on('click', '.foodsadd-group .foodsadd-add-item', function (event) {
            var target = jQuery(event.currentTarget);
            var parent = target.closest('.foodsadd-group');
            var label = parent.find('.foodsadd-product-label');
            var len = label.length;
            if (len === 0) {
                target.before('<label class=\'foodsadd-product-label\'>Product</label>');
            }
            target.before(self.createProductDiv(true));
        });

        jQuery(document).on('click', '.foodsadd-brand-remove', function (event) {

            var target = jQuery(event.currentTarget);
            var parent = target.closest('.foodsadd-group');

            // Remove the product
            parent.remove();

        });

        jQuery(document).on('click', '.foodsadd-remove', function (event) {

            var target = jQuery(event.currentTarget);
            var parent = target.closest('.foodsadd-group');
            var product = target.closest('.foodsadd-product-div');
            var productLen = parent.find('.foodsadd-product-div').length;

            // Remove the product
            product.remove();

            var label = parent.find('.foodsadd-product-label');

            if (productLen === 1) {
                label.remove();
            }
        });

    }

    numberSelect(event, type) {
        var selected = jQuery('#foodsadd_numberselect .btn.selected');
        selected.removeClass('selected');
        jQuery(event.target).addClass('selected');
        jQuery('.subcontent').removeClass(selected[0].value.toLowerCase()).addClass(type);
    }

    typeSelect(event) {
        var selected = jQuery('#foodsadd_typeselect .btn.selected');
        selected.removeClass('selected');
        jQuery(event.target).addClass('selected');
    }

    createBrandButton(event) {

        var target = jQuery(event.target);
        target.before(this.createBrandDiv());

    }

    save(event) {

        var self = this;
        var data = this.getData();

        if (data.length < 1) {
            Client.NoFoodz.alert.msg('danger', 'Invalid data');
            return;
        }

        Meteor.call('createItems', data, function (error, result) {
            var response = _.extend({}, result);
            response.error = error;
            self.saveFinished(response, data[0].type);
        });

    }

    saveFinished(response, type) {

        if (response.error) {
            Client.NoFoodz.alert.msg('danger', response.error.reason);
        } else if (response._id) {
            this.router.navigate(['/Pages/Item', {_id: response._id, type: type}]);
        } else {
            Client.NoFoodz.alert.msg('success', 'Successfully added');
            jQuery('.foodsadd-brand-remove').click();
        }

    }

    getData() {

        var selectionType = jQuery('#foodsadd_numberselect button.selected')[0].value,
            type = jQuery('#foodsadd_typeselect .btn.selected').attr('value'),
            data = [];

        switch (selectionType) {
            case 's':

                var name = jQuery('#foodsadd_name').val(),
                    brand = jQuery('#foodsadd_brand').val(),
                    brandId = jQuery('#foodsadd_brand').data('brand_id'),
                    rating = this.nofoodsRating.getValue();

                if (!name || !brand) {
                    return [];
                }

                data.push({
                    brand: brand,
                    brand_id: brandId,
                    type: type.toLowerCase(),
                    items: [{
                        name: name,
                        rating: rating,
                        tags: []
                    }]
                });

                break;

            case 'm':

                jQuery('.foodsadd-group').each(function () {

                    var item = {},
                        group = jQuery(this),
                        brand = group.find('.foodsadd-brand-input');

                    item['brand'] = brand.val();
                    item['type'] = type;
                    item['items'] = [];

                    group.find('.foodsadd-product-div').each(function () {
                        var productDiv = jQuery(this),
                            name = productDiv.find('.foodsadd-name-input').val(),
                            tagString = productDiv.find('.foodsadd-name-tags').val(),
                            tags = tagString.length > 0 ? productDiv.find('.foodsadd-name-tags').val().toLowerCase().split(' ') : [];

                        if (!item['brand'] || !name) {
                            return [];
                        }

                        item['items'].push({
                            name: name,
                            tags: tags
                        });
                    });

                    data.push(item);

                });

                break;

        }

        return data;

    }

    createBrandDiv() {

        var div = jQuery('<div class=\'foodsadd-group\'></div>'),
            label = jQuery(' <label>Brand</label>');

        div.append(label);
        div.append(' <input class=\'foodsadd-brand-input\' type=\'text\' placeholder=\'Brand\'/>');
        div.append('<button type=\'button\' class=\'foodsadd-brand-remove btn-default red-button\'><span class=\'button-icon glyphicon glyphicon-minus\'></span>Remove</button>');
        div.append('<button type=\'button\' class=\'foodsadd-add-item btn-default blue-button\'><span class=\'button-icon glyphicon glyphicon-plus\'></span>Item</button>');

        return div;

    }

    createProductDiv(removeButton) {

        var div = jQuery('<div class=\'foodsadd-product-div\'></div>'),
            divInput = jQuery('<div></div>'),
            divTags = jQuery('<div></div>');

        divInput.append('<input class=\'foodsadd-name-input\' type=\'text\' placeholder=\'Product\'/>');

        if (removeButton)
            divInput.append('<button type=\'button\' class=\'foodsadd-remove btn-default red-button\'><span class=\'button-icon glyphicon glyphicon-minus\'></span>Remove</button>');

        divTags.append('<input type=\'text\' class=\'foodsadd-name-tags\' />');

        div.append(divInput);
        div.append(divTags);

        return div;

    }

}