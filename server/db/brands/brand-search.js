Meteor.methods({

    getBrand: function (options) {

        check(options, {
            brand_id: NonEmptyStringNoSpaceCharacters
        });

        var response = {};

        var query = {
            brand_id: options.brand_id
        };

        var filter = {
            sort: {name: -1},
            fields: {name: -1}
        };

        response.brand = Brands.findOne({
            _id: options.brand_id
        }, filter);

        return response;
    },

    getByBrand: function (options) {

        check(options, {
            brand_id: NonEmptyStringNoSpaceCharacters,
            type: TypeCheck
        });

        var response = {};

        var query = {
            brand_id: options.brand_id
        };

        var filter = {
            fields: {
                name: 1,
                flags: 1
            },
            sort: {
                name: -1
            }
        };

        response.brand = Brands.findOne({
            _id: options.brand_id
        }, filter);

        var itemFilter = {
            fields: {
                _id: 1,
                name: 1,
                ratingtotal_calc: 1,
                ratingcount_calc: 1
            },
            sort: {
                name: -1
            }
        };

        var db = NoFoodz.db.typeToDb(options.type);

        response.items = db.find(query, itemFilter).fetch();

        return response;
    },

    getAllByBrand: function (options) {

        check(options, {
            brand_id: NonEmptyStringNoSpaceCharacters
        });

        var response = {};

        var query = {
            brand_id: options.brand_id
        };

        var filter = {
            fields: {
                name: 1,
                flags: 1
            },
            sort: {
                name: -1
            }
        };

        response.brand = Brands.findOne({
            _id: options.brand_id
        }, filter);

        var itemFilter = {
            fields: {
                _id: 1,
                name: 1,
                ratingtotal_calc: 1,
                ratingcount_calc: 1
            },
            sort: {
                name: -1
            }
        };

        response.drinks = Drinks.find(query, itemFilter).fetch();
        response.foods = Foods.find(query, itemFilter).fetch();
        response.products = Products.find(query, itemFilter).fetch();

        return response;
    }

});