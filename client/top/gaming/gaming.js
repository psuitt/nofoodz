/**
 * Created by Sora on 11/20/2015.
 */
Template.gaming.rendered = function () {
    screenData = this.data;
    $('span.pagetitle-subtext').text(NoFoodz.format.camelCase(screenData.query.title));
    loadItems(screenData.query);
};

var loadItems = function (query) {

    var typeUpper = query.type.toUpperCase();

    Meteor.call('itemTagSearch', {tags: query.tags.split(','), type: query.type}, function (err, response) {

        if (!err && response) {

            var list = $('#gaming_list');

            _.each(response, function (item, index) {

                var listItem = $('<li></li>');
                var div = $('<div class=\'myrating myfoods\'></div>');

                var title = $('<span class=\'name item-color myfoods\'><a></a></span>');

                var brand = $('<span class=\'brand brand-color myfoods\'><a></a></span>');
                brand.find('a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);

                title.addClass('lower');

                div.append(title);
                div.append(brand);

                var avg = NoFoodz.format.calculateAverageDisplay(item);

                div.append(NoFoods.widgetlib.createHeart(avg, item.ratingcount_calc));

                title.find('a').attr('href', NoFoodz.consts.urls[typeUpper] + item._id).html(item.name);


                listItem.append(div);
                list.append(listItem);

            });

        }

        $('[data-toggle=\'tooltip\']').tooltip();

    });

};