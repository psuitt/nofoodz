var placeauto,
    map,
    nofoodsRating,
    brand_id = false;

Template.foodsadd.destroyed = function () {
    // reset brand id.
    brand_id = false
};

Template.foodsadd.rendered = function () {

    if (!Meteor.userId()) {
        Router.go('home');
        return;
    }

    var data = this.data;

    // reset brand id.
    brand_id = false

    setPath();

    nofoodsRating = $('div.ratingDiv').nofoodsrating();

    if (data && data.brand_id) {
        brand_id = data.brand_id;
        var obj = {
            brand_id: data.brand_id
        };
        Meteor.call('getBrand', obj, function (err, data) {

            if (!err) {

                var brand = data.brand;

                if (brand) {
                    $('#foodsadd-brand').attr("disabled", "disabled").val(brand.name);
                } else {
                    brand_id = false;
                    //$('#foodsadd-brand').nofoodsautocomplete();
                }

            }

        });

    } else {
        //$('#foodsadd-brand').nofoodsautocomplete();
    }

    $('[data-role=\'tagsinput\']').tagsinput({
        tagClass: 'nofoodz-tag'
    });

    //addLocation(); LOCATION

};

Template.foodsadd.events({
    'click #save': function (event, template) {

        var data = getData(template);

        Meteor.call('createProducts', data, function (error, result) {
            var response = _.extend({}, result);
            response.error = error;
            saveFinished(response, data[0].type);
        });

    },

    'click #foodsadd_typeselect .btn': function (event, template) {
        var selected = $('#foodsadd_typeselect .btn.selected');
        selected.removeClass('selected');
        $(event.currentTarget).addClass('selected');
    },

    'click #foodsadd_numberselect .btn': function (event, template) {
        var selected = $('#foodsadd_numberselect .btn.selected');
        selected.removeClass('selected');
        $(event.currentTarget).addClass('selected');
        $('.subcontent').addClass(event.currentTarget.value.toLocaleLowerCase()).removeClass(selected[0].value.toLowerCase());
    },

    'click #foodsadd_add_brand': function (event, template) {

        var target = $(event.currentTarget);
        target.before(createBrandDiv());

    },

    'click .foodsadd-group .foodsadd-add-item': function (event, template) {
        var target = $(event.currentTarget);
        var parent = target.closest('.foodsadd-group');
        var label = parent.find('.foodsadd-product-label');
        var len = label.length;
        if (len === 0) {
            target.before('<label class=\'foodsadd-product-label\'>Product</label>');
        }
        target.before(createProductDiv(true));
    },

    'click .foodsadd-brand-remove': function (event, template) {

        var target = $(event.currentTarget);
        var parent = target.closest('.foodsadd-group');

        // Remove the product
        parent.remove();

    },

    'click .foodsadd-remove': function (event, template) {

        var target = $(event.currentTarget);
        var parent = target.closest('.foodsadd-group');
        var product = target.closest('.foodsadd-product-div');
        var productLen = parent.find('.foodsadd-product-div').length;

        // Remove the product
        product.remove();

        var label = parent.find('.foodsadd-product-label');

        if (productLen === 1) {
            label.remove();
        }
    }

});

var saveFinished = function (response, type) {

    if (response.error) {
        $('.page-message.message').addClass('alert alert-danger').html(response.error.reason);
    } else if (response._id) {
        Router.go('foods', {_id: response._id, type: type.toLowerCase()});
    } else {
        $('.page-message.message').addClass('alert alert-success').html('Successfully added');
    }

};

var getData = function (template) {

    var selectionType = $('#foodsadd_numberselect button.selected')[0].value,
        type = $('#foodsadd_typeselect .btn.selected').attr('value'),
        data = [];

    switch (selectionType) {
        case 's':

            var name = template.find('#foodsadd_name').value,
                brand = template.find('#foodsadd_brand').value,
                brandId = $('#foodsadd_brand').data('brand_id'),
                rating = nofoodsRating.getValue();

            data.push({
                brand: brand,
                type: type.toLowerCase(),
                items: [{
                    name: name,
                    rating: rating,
                    tags: []
                }]
            });

            break;

        case 'm':

            $('.foodsadd-group').each(function () {

                var item = {},
                    group = $(this),
                    brand = group.find('.foodsadd-brand-input');

                item.brand = brand.val();
                item.type = type;
                item.items = [];

                group.find('.foodsadd-product-div').each(function () {
                    var productDiv = $(this),
                        name = productDiv.find('.foodsadd-name-input').val(),
                        tags = productDiv.find('.foodsadd-name-tags').tagsinput('items');

                    item.items.push({
                        name: name,
                        tags: tags
                    });
                });

                data.push(item);

            });

            break;

    }

    return data;

};

var createBrandDiv = function () {

    var div = $('<div class=\'foodsadd-group\'></div>'),
        label = $(' <label>Brand</label>');

    div.append(label);
    div.append(' <input class=\'foodsadd-brand-input\' type=\'text\' placeholder=\'Brand\'/>');
    div.append('<button type=\'button\' class=\'foodsadd-brand-remove btn-default red-button\'><span class=\'button-icon glyphicon glyphicon-minus\'></span>Remove</button>');
    div.append('<button type=\'button\' class=\'foodsadd-add-item btn-default blue-button\'><span class=\'button-icon glyphicon glyphicon-plus\'></span>Item</button>');

    return div;

};

var createProductDiv = function (removeButton) {

    var div = $('<div class=\'foodsadd-product-div\'></div>'),
        divInput = $('<div></div>'),
        divTags = $('<div></div>');

    divInput.append('<input class=\'foodsadd-name-input\' type=\'text\' placeholder=\'Product\'/>');

    if (removeButton)
        divInput.append('<button type=\'button\' class=\'foodsadd-remove btn-default red-button\'><span class=\'button-icon glyphicon glyphicon-minus\'></span>Remove</button>');

    divTags.append('<input type=\'text\' data-role=\'tagsinput\' class=\'foodsadd-name-tags\' />');

    div.append(divInput);
    div.append(divTags);

    div.find('[data-role=\'tagsinput\']').tagsinput({
        tagClass: 'nofoodz-tag'
    });

    return div;

};

