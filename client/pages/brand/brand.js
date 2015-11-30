Template.brandsTemplate.destroyed = function () {

};

Template.brandsTemplate.rendered = function () {

    var data = this.data;
    fetchData(data._id);

    $('.nofoods-pagenav a').click(function (e) {
        if (!$(this).hasClass('button')) {
            e.preventDefault();
            $(this).tab('show');
        }
    });

    NoFoods.widgetlib.floatMenu($('#brands-nav'));

};

var fetchData = function (brand_id) {

    var obj = {
        brand_id: brand_id
    }

    Meteor.call('getAllByBrand', obj, function (err, data) {

        if (!err) {

            var brand = data.brand;

            if (!brand)
                Router.go('error.404');

            $('.brand-name').html(brand.name);

            if (brand.flags && brand.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1)
                $('.button.report').addClass('reported')
                    .html('Reported')
                    .attr('title', 'This item has been reported.');

            loadItems(data.foods, NoFoodz.consts.FOOD);
            loadItems(data.drinks, NoFoodz.consts.DRINK);
            loadItems(data.products, NoFoodz.consts.PRODUCT);


        }

    });

};

var loadItems = function (items, type) {

    var avg = 0;

    $('#brand_list' + type).text('');
    $('#brand_totalrating' + type).text('');

    if (items && items.length > 0) {

        var total = 0;
        var count = 0;

        _.each(items, function (item, index) {

            var div = $('<div></div>'),
                link = $('<a></a>');

            link.addClass('item-color');
            link.attr('href', NoFoodz.consts.urls[type.toUpperCase()] + item._id).html(item.name);

            div.append(link);

            $('#brand_list' + type).append(div);
            total += parseInt(item.ratingtotal_calc, 10);
            count += parseInt(item.ratingcount_calc, 10);

        });

        if (total > 0) {
            avg = (total / parseFloat(count)).toFixed(2);
        }

        $('#brand_totalrating' + type).text(avg);

    } else {
        // Hide the parent list item.
        $('#brand_totalrating' + type).hide();
        $('label[for=\'brand_totalrating' + type + '\']').hide();
        $('[href=\'#brand_' + type + '\']').parent().hide();
    }

}

