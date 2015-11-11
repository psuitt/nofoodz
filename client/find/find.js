/**
 * Created by Sora on 8/31/2015.
 */
var results = false,

    MAX_RESULTS = 3,
    paging;

Template.find.rendered = function () {

    var data = this.data;

};

Search = function (type, search) {

    if (!type || !search)
        return;

    $('#menu span.nofoodssearch.text').text(type.substring(0, 1).toUpperCase() + type.substring(1));
    $('#menu .nofoodssearch input').val(search);

    $('div.loading').removeClass('hide');

    switch (type) {
        case 'food':
        case 'drink':
        case 'product':
            doSearch(search, type);
            break;
        case 'brand':
            doSearchBrands(search, type);
            break;
        case 'people':
            doSearchPeople(search);
            break;
        default:
            break;
    }

};

var doSearch = function (search, type) {

    $('#findResults').html('');

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

                results = response.data;

                if (count < 99) {
                    $('#findResultsCount').html(count + ' results found');
                } else {
                    $('#findResultsCount').html('100+ results found');
                }

                if (count === 0) {

                    $('#findResultsCount').html('No results found');

                } else {

                    getPage.call({url: NoFoodz.consts.urls[type.toUpperCase()]}, 1);

                    if (paging)
                        paging.remove();

                    $('#findContent').append('<div class=\'search-paging\'></div>');
                    paging = $('#findContent .search-paging').nofoodspaging({
                        max: results.length / MAX_RESULTS,
                        select: getPage,
                        data: {url: NoFoodz.consts.urls[type.toUpperCase()]}
                    });

                }

            } else {
                $('#findResultsCount').html('No results found');
            }

        }

        $('div.loading').addClass('hide');

    });
};

var getPage = function (page) {

    var offset = MAX_RESULTS * (page - 1),
        offsetMax = MAX_RESULTS * (page),
        len = results.length;

    $('#findResults').html('');

    if (len > offsetMax) {
        len = offsetMax;
    }

    for (var i = offset; i < len; i += 1) {
        var item = results[i];
        $('#findResults').append(getSearchRow(this.url, item));
    }

};

var getSearchRow = function (link, item) {

    var div = $('<div></div>'),
        name = $('<span></span>'),
        brand = $('<span></span>'),
        rating = $('<span></span>'),
        aName = $("<a target='_top'></a>"),
        aBrand = $("<a class='brand' target='_top'></a>"),
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

};

var doSearchBrands = function (search, type) {

    $('#findResults').html('');

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

                results = response.data;

                if (count < 99) {
                    $('#findResultsCount').html(count + ' results found');
                } else {
                    $('#findResultsCount').html('100+ results found');
                }

                if (count === 0) {

                    $('#findResultsCount').html('No results found');

                } else {

                    getBrandPage(1);

                    if (paging)
                        paging.remove();

                    $('#findContent').append('<div class=\'search-paging\'></div>');
                    paging = $('#findContent .search-paging').nofoodspaging({
                        max: results.length / MAX_RESULTS,
                        select: getBrandPage,
                        data: {url: NoFoodz.consts.urls[type.toUpperCase()]}
                    });

                }

            } else {
                $('#findResultsCount').html('No results found');
            }

        }

        $('div.loading').addClass('hide');

    });
};

var getBrandPage = function (page) {

    var offset = MAX_RESULTS * (page - 1),
        offsetMax = MAX_RESULTS * (page),
        len = results.length;

    $('#findResults').html('');

    if (len > offsetMax) {
        len = offsetMax;
    }

    for (var i = offset; i < len; i += 1) {
        var item = results[i];
        $('#findResults').append(getBrandSearchRow(item));
    }

};
var getBrandSearchRow = function (item) {

    var div = $('<div></div>'),
        brand = $('<span></span>'),
        aBrand = $("<a class='brand' target='_top'></a>");

    div.addClass('item');
    brand.addClass('itemBrand');

    aBrand.attr('href', NoFoodz.consts.urls.BRAND + item._id);
    aBrand.text(item.name);

    brand.append(aBrand);

    div.append(brand);

    return div;

};


var doSearchPeople = function (search) {

    var htmlBuilder = [];

    $('#findContent').html('');
    $('#findResults').html('');

    var obj = {
        'username': search
    };

    Meteor.call('findUsers', obj, function (err, response) {

        if (!err) {

            if (response.data) {

                var count = response.data.length;

                results = response.data;

                if (count < 20) {
                    $('#findResultsCount').html(count + ' results found');
                } else {
                    $('#findResultsCount').html('20+ results found');
                }

                _.each(response.data, function (value, key) {

                    var div = $('<div></div>'),
                    //icon = $('<span>NO IMAGE AVAILABLE</span>'),
                        name = $('<span></span>'),
                        aName = $("<a target='_top'></a>");

                    div.addClass('item');
                    //icon.addClass('itemIcon');
                    name.addClass('itemName');

                    aName.attr('href', NoFoodz.consts.urls.PEOPLE + value.username);
                    aName.html(value.username);

                    name.append(aName);
                    //div.append(icon);
                    div.append(name);
                    $('#findResults').append(div);

                });

            }
        }

        $('div.loading').addClass('hide');

    });

};
