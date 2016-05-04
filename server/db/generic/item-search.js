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
        response.datatype = options.type;

        if (response.data.length === 0 && options.type !== NoFoodz.consts.db.BRAND) {
            db = NoFoodz.db.typeToDb(NoFoodz.consts.db.BRAND);
            response.data = db.find(query, filter).fetch();
            response.datatype = NoFoodz.consts.db.BRAND;
        }

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
                rating: -1
            }

        };

        return db.find(query, filter).fetch();

    }

});