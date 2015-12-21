Meteor.methods({

    getUserRatings: function (options) {

        check(options, {
            type: TypeCheck,
            page: PageNumber,
            count: Match.Optional(Boolean),
            user_id: Match.Optional(NonEmptyStringNoSpecialCharacters),
            search: Match.Optional(NonEmptyStringNoSpecialCharacters)
        });

        var response = false,
            page = options.page,
            t = options.type.toLowerCase();

        var query = {
            rating: {$gt: 0}
        };

        if (options.user_id) {
            query.user_id = options.user_id;
        } else {
            query.user_id = this.userId;
        }

        var filter = {
            fields: {
                _id: 1,
                item_id: 1,
                brand_id: 1,
                name_view: 1,
                brand_view: 1,
                rating: 1
            },
            sort: {date: -1}
        };

        var item_ids = [],
            db = NoFoodz.db.typeToRatingsDb(t);

        response = {
            ratings: []
        };

        if (options.search) {

            filter.fields.score = {
                $meta: 'textScore'
            };

            filter.sort = {
                score: {
                    $meta: 'textScore'
                }
            };

            query.$text = {
                $search: options.search
            };

        }

        if (!options.count) {

            filter.skip = PAGE_LIMIT * (page - 1);
            filter.limit = PAGE_LIMIT;

            db.find(query, filter).forEach(function (rating) {
                item_ids.push(rating.item_id);
                response.ratings.push(rating);
            });

        } else {

            filter.limit = 100;

            var results = db.find(query, filter).fetch();

            // set the total count.
            response.count = results.length;
            response.maxPageSize = PAGE_LIMIT;

            var offset = PAGE_LIMIT * (page - 1),
                offsetMax = PAGE_LIMIT * (page),
                len = response.count;

            if (len > offsetMax) {
                len = offsetMax;
            }

            for (var i = offset; i < len; i += 1) {
                var rating = results[i];
                item_ids.push(rating.item_id);
                response.ratings.push(rating);
            }

        }

        return response;
    }
});
