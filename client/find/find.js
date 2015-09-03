/**
 * Created by Sora on 8/31/2015.
 */
var results = false,

    MAX_RESULTS = 3,
    paging;

Template.find.rendered = function () {

    var data = this.data;
    $('#menu span.nofoodssearch.text').text(data.type);
    $('#menu .nofoodssearch input').val(data.search);
    Search(data.type, data.search);

};

Search = function (type, search) {

    if (!type || !search)
        return;

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

    Meteor.call(type + 'Search', obj, function (err, response) {

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

var doSearchPeople = function (search) {

    var htmlBuilder = [];

    $('#findContent').html('');

    Meteor.subscribe('users_search', search, function () {
        var results = Meteor.users.find({}),
            count = results.count() - 1,
            user_id = Meteor.userId();

        if (count < 1) {

            $('#search-peoplelink').html("People (" + 0 + ")");
            $('#search-people').html("<div class='resultsTotals'>No results found</div>");

        } else {

            if (count < 19) {
                $('#search-peoplelink').html("People (" + count + ")");
            } else {
                $('#search-peoplelink').html("People (20+)");
            }

            $('#search-people').html("<div class='resultsTotals'>" + count + " results found</div>");

            results.forEach(function (user) {
                var div = $('<div></div>'),
                //icon = $('<span>NO IMAGE AVAILABLE</span>'),
                    name = $('<span></span>'),
                    aName = $("<a target='_top'></a>");

                div.addClass('item');
                //icon.addClass('itemIcon');
                name.addClass('itemName');

                aName.attr('href', NoFoodz.consts.urls.PEOPLE + user.username);
                aName.html(user.username);

                name.append(aName);
                //div.append(icon);
                div.append(name);
                user_id !== user._id && $('#search-people').append(div);
            });

        }

        $('div.loading').addClass('hide');
        $('#resultsDiv').show();
        $('#search-people').removeClass('hide');

    });

};

var getSearchRow = function (link, item) {

    var div = $('<div></div>'),
        name = $('<span></span>'),
        brand = $('<span></span>'),
        rating = $('<span></span>'),
        aName = $("<a target='_top'></a>"),
        aBrand = $("<a class='brand' target='_top'></a>");

    div.addClass('item');
    name.addClass('itemName');
    brand.addClass('itemBrand');
    rating.addClass('itemRating');

    aName.attr('href', link + item._id);
    aName.html(item.name);

    aBrand.attr('href', NoFoodz.consts.urls.BRAND + item.brand_id);
    aBrand.html(item.brand_view);

    rating.attr('title', item.rating_calc)
    var i = (Math.round((item.rating_calc * 2)) * 10).toString();

    rating.addClass('rating');
    rating.addClass('x' + i);

    name.append(aName);
    brand.append(aBrand);
    name.append(brand);
    div.append(rating);
    div.append(name);

    return div;

};
