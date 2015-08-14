MAP_DATA = {};
var statsSub,
    activeSub;

Template.wsie.destroyed = function() {
    statsSub && statsSub.stop();
    activeSub && activeSub.stop();
};

Template.wsie.rendered = function() {

    setPath();

    statsSub = Meteor.subscribe('statistics_country', function() {

        Statistics.find({}).forEach(function(stat) {

            var div = $("<div></div>");
            div.html(stat.country + " Foods and Drinks: " + stat.length);
            $("div.contents").append(div);

            MAP_DATA[stat.countrycode] = {
                numberofitems: stat.length
            };

        });

    });

    initMap();

    $('.wsie-options').on('click', 'a', menuClick);
    $('.wsie-options a').eq(0).click();

};

var menuClick = function() {

    var self = $(this),
        dataType = self.attr('datatype'),
        sub = self.attr('sub');

    var tempScrollTop = $(window).scrollTop();

    $('#wsie-content').html('');
    $('.wsie-options a').removeClass('selected');
    self.addClass('selected');

    if (!dataType || !sub)
        return;

    var collection = false;

    switch(dataType) {
        case 'food':
            collection = Foods;
            break;
        case 'drink':
            collection = Drinks;
            break;
        default:
            return;

    }

    var list = $('<ol><ol>');

    activeSub = Meteor.subscribe(sub, function() {

        collection.find({}).forEach(function(item) {
            var listItem = $("<li></li>");
            var div = $("<div class='myrating myfoods'></div>");
            var title = $("<span class='name myfoods'><a></a></span>");
            var brand = $("<span class='brand myfoods'><a></a></span>");

            title.addClass("lower");

            div.append(title);
            div.append(brand);
            div.append(NoFoods.widgetlib.createHeart(item.rating_calc, item.ratingcount_calc));

            title.find('a').attr('href', NoFoodz.consts.urls[dataType.toUpperCase()] + item._id).html(item.name);
            brand.find('a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);

            listItem.append(div);
            list.append(listItem);

        });

        $('#wsie-content').append(list);

        $(window).scrollTop(tempScrollTop);

        activeSub.stop();

    });

};
