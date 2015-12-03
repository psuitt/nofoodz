var menuClick = function () {

    var self = $(this),
        dataType = self.attr('datatype');

    var tempScrollTop = $(window).scrollTop();

    $('#explore-content').html('');
    $('.explore-options button').removeClass('selected');
    self.addClass('selected');

    if (!dataType)
        return;

    var list = $('<ol><ol>');

    Meteor.call('itemTopRatedSearch', {type: dataType}, function (err, response) {

        if (!err && response) {

            _.each(response, function (item, index) {

                var listItem = $("<li></li>");
                var div = $("<div class='myrating myfoods'></div>");
                var title = $("<span class='name item-color myfoods'><a></a></span>");
                var brand = $("<span class='brand brand-color myfoods'><a></a></span>");

                title.addClass("lower");

                div.append(title);
                div.append(brand);

                var avg = item.ratingtotal_calc > 0 ? (item.ratingtotal_calc / parseFloat(item.ratingcount_calc)).toFixed(2) : 0;

                if (avg != 0 && avg.lastIndexOf('0') === 3) {
                    avg = avg.substring(0, 3);
                    avg = avg.replace('.0', '');
                }

                div.append(Client.NoFoodz.widgetlib.createHeart(avg, item.ratingcount_calc));

                title.find('a').attr('href', NoFoodz.consts.urls[dataType.toUpperCase()] + item._id).html(item.name);
                brand.find('a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);

                listItem.append(div);
                list.append(listItem);

            });

        }

        $('#explore-content').append(list);

        $(window).scrollTop(tempScrollTop);

        $('[data-toggle=\'tooltip\']').tooltip();

    });

};

/** Listeners */
$(document).on('click', '.explore-options button', menuClick);

