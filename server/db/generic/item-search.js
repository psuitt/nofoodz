Meteor.methods({

    itemSearch: function (options) {

        check(options, {
            'search': NonEmptyString,
            'type': TypeCheck
        });

        var response = {};

        var filter = {
            limit: 50,
            fields: {
                name: 1,
                brand_id: 1,
                brand_view: 1,
                ratingtotal_calc: 1,
                ratingcount_calc: 1
            }

        };

        var db = NoFoodz.db.typeToDb(options.type);

        if (options.type.toLowerCase() === 'brand') {
            var query = {
                brand_view: {
                    $regex: ".*" + NoFoodz.utils.StripCharacters(options.search) + ".*",
                    $options: 'i'
                }
            };
            response.data = db.find(query, filter).fetch();
            return response;
        }

        filter.fields.score = {
            $meta: 'textScore'
        };

        filter.sort = {
            score: {
                $meta: 'textScore'
            }
        };

        var query = {
            $text: {
                $search: options.search
            }
        };

        response.data = db.find(query, filter).fetch();
        return response;

    },

    itemBrandSearch: function (options) {

        check(options, {
            'search': NonEmptyStringNoSpecialCharacters
        });

        var response = {};

        var filter = {
            limit: 50,
            fields: {
                name: 1,
                score: {
                    $meta: 'textScore'
                }
            },
            sort: {
                score: {
                    $meta: 'textScore'
                }
            }
        };

        var query = {
            $text: {
                $search: options.search
            }
        };

        response.data = Brands.find(query, filter).fetch();
        return response;

    },

    itemTagSearch: function (options) {

        check(options, {
            'tags': TagsArrayCheck,
            'type': TypeCheck
        });

        if (options.tags.length < 1)
            return [];

        var db = NoFoodz.db.typeToDb(options.type);

        var query = {
            tags: {$all: options.tags}
        };

        var filter = {
            limit: 10,
            fields: {
                name: 1,
                brand_id: 1,
                brand_view: 1,
                ratingtotal_calc: 1,
                ratingcount_calc: 1
            },
            sort: {
                brand_view: 1,
                rating: -1,
            }

        };

        return db.find(query, filter).fetch();

    }

});