/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/angular2';

import {RouterLink, RouteParams} from 'angular2/router';

import {bootstrap} from 'angular2-meteor';

declare var jQuery:any;
declare var _:any;
declare var NoFoodz:any;

@Component({
    selector: 'find'
})

@View({
    templateUrl: '/client/find/find.html',
    directives: [RouterLink]
})

export class Find {

    results:any;
    MAX_RESULTS:number;
    paging:any;

    constructor(params:RouteParams) {

        this.results = [];
        this.MAX_RESULTS = 3;

        this.search(params.get('type'), params.get('search'));

    }

    search(type, search) {

        if (!type || !search)
            return;

        jQuery('#menu span.nofoodssearch.text').text(type.substring(0, 1).toUpperCase() + type.substring(1));
        jQuery('#menu .nofoodssearch input').val(search);

        jQuery('div.loading').removeClass('hide');

        switch (type) {
            case 'food':
            case 'drink':
            case 'product':
                this.doSearch(search, type);
                break;
            case 'brand':
                this.doSearchBrands(search, type);
                break;
            case 'people':
                this.doSearchPeople(search);
                break;
            default:
                break;
        }

    }

    doSearch(search, type) {

        var self = this;

        jQuery('#findResults').html('');

        if (!search) {
            return;
        }

        var obj = {
            'search': search,
            'type': type
        };

        Meteor.call('itemSearch', obj, function (err, response) {

            if (!err) {

                if (response.data) {

                    var count = response.data.length;

                    self.results = response.data;

                    if (count < 99) {
                        jQuery('#findResultsCount').html(count + ' results found');
                    } else {
                        jQuery('#findResultsCount').html('100+ results found');
                    }

                    if (count === 0) {

                        jQuery('#findResultsCount').html('No results found');

                    } else {

                        self.createGetPage().call({url: NoFoodz.consts.urls[type.toUpperCase()]}, 1);

                        if (self.paging)
                            self.paging.remove();

                        jQuery('#findContent').append('<div class=\'search-paging\'></div>');
                        self.paging = jQuery('#findContent .search-paging').nofoodspaging({
                            max: self.results.length / self.MAX_RESULTS,
                            select: self.createGetPage(),
                            data: {url: NoFoodz.consts.urls[type.toUpperCase()]}
                        });

                    }

                } else {
                    jQuery('#findResultsCount').html('No results found');
                }

            }

            jQuery('div.loading').addClass('hide');

        });
    }

    createGetPage() {

        var self = this;

        return function (page) {

            var offset = self.MAX_RESULTS * (page - 1),
                offsetMax = self.MAX_RESULTS * (page),
                len = self.results.length;

            jQuery('#findResults').html('');

            if (len > offsetMax) {
                len = offsetMax;
            }

            for (var i = offset; i < len; i += 1) {
                var item = self.results[i];
                jQuery('#findResults').append(self.getSearchRow(this['url'], item));
            }

        };

    }

    getSearchRow(link, item) {

        var div = jQuery('<div></div>'),
            name = jQuery('<span></span>'),
            brand = jQuery('<span></span>'),
            rating = jQuery('<span></span>'),
            aName = jQuery("<a target='_top'></a>"),
            aBrand = jQuery("<a class='brand' target='_top'></a>"),
            ratingValue = item.ratingtotal_calc > 0 ? item.ratingtotal_calc / item.ratingcount_calc : 0;

        div.addClass('item');
        name.addClass('itemName');
        brand.addClass('itemBrand');
        rating.addClass('itemRating');

        aName.attr('href', link + item._id);
        aName.html(item.name);

        aBrand.attr('href', NoFoodz.consts.urls.BRAND + item.brand_id);
        aBrand.html(item.brand_view);

        rating.attr('title', ratingValue)
        var i = (Math.round((ratingValue * 2)) * 10).toString();

        rating.addClass('rating');
        rating.addClass('x' + i);

        name.append(aName);
        brand.append(aBrand);
        name.append(brand);
        div.append(rating);
        div.append(name);

        return div;

    }

    doSearchBrands(search, type) {

        var self = this;

        jQuery('#findResults').html('');

        if (!search) {
            return;
        }

        var obj = {
            'search': search
        };

        Meteor.call('itemBrandSearch', obj, function (err, response) {

            if (!err) {

                if (response.data) {

                    var count = response.data.length;

                    self.results = response.data;

                    if (count < 99) {
                        jQuery('#findResultsCount').html(count + ' results found');
                    } else {
                        jQuery('#findResultsCount').html('100+ results found');
                    }

                    if (count === 0) {

                        jQuery('#findResultsCount').html('No results found');

                    } else {

                        self.createGetBrandPage()(1);

                        if (self.paging)
                            self.paging.remove();

                        jQuery('#findContent').append('<div class=\'search-paging\'></div>');
                        self.paging = jQuery('#findContent .search-paging').nofoodspaging({
                            max: self.results.length / self.MAX_RESULTS,
                            select: self.createGetBrandPage(),
                            data: {url: NoFoodz.consts.urls[type.toUpperCase()]}
                        });

                    }

                } else {
                    jQuery('#findResultsCount').html('No results found');
                }

            }

            jQuery('div.loading').addClass('hide');

        });
    }

    createGetBrandPage() {

        var self = this;

        return function (page) {
            var offset = self.MAX_RESULTS * (page - 1),
                offsetMax = self.MAX_RESULTS * (page),
                len = self.results.length;

            jQuery('#findResults').html('');

            if (len > offsetMax) {
                len = offsetMax;
            }

            for (var i = offset; i < len; i += 1) {
                var item = self.results[i];
                jQuery('#findResults').append(self.getBrandSearchRow(item));
            }

        };

    }

    getBrandSearchRow(item) {

        var div = jQuery('<div></div>'),
            brand = jQuery('<span></span>'),
            aBrand = jQuery("<a class='brand' target='_top'></a>");

        div.addClass('item');
        brand.addClass('itemBrand');

        aBrand.attr('href', NoFoodz.consts.urls.BRAND + item._id);
        aBrand.text(item.name);

        brand.append(aBrand);

        div.append(brand);

        return div;

    }


    doSearchPeople(search) {

        var self = this;
        var htmlBuilder = [];

        jQuery('#findContent').html('');
        jQuery('#findResults').html('');

        var obj = {
            'username': search
        };

        Meteor.call('findUsers', obj, function (err, response) {

            if (!err) {

                if (response.data) {

                    var count = response.data.length;

                    self.results = response.data;

                    if (count < 20) {
                        jQuery('#findResultsCount').html(count + ' results found');
                    } else {
                        jQuery('#findResultsCount').html('20+ results found');
                    }

                    _.each(response.data, function (value, key) {

                        var div = jQuery('<div></div>'),
                        //icon = $('<span>NO IMAGE AVAILABLE</span>'),
                            name = jQuery('<span></span>'),
                            aName = jQuery("<a target='_top'></a>");

                        div.addClass('item');
                        //icon.addClass('itemIcon');
                        name.addClass('itemName');

                        aName.attr('href', NoFoodz.consts.urls.PEOPLE + value.username);
                        aName.html(value.username);

                        name.append(aName);
                        //div.append(icon);
                        div.append(name);
                        jQuery('#findResults').append(div);

                    });

                }
            }

            jQuery('div.loading').addClass('hide');

        });

    };

}