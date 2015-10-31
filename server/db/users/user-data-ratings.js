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
            user_id: options.user_id ? options.user_id : this.userId,
            rating: {$gt: 0}
        };

        var filter = {
            sort: {date: -1}
        };

        if (this.userId) {

            var item_ids = [],
                db = NoFoodz.db.typeToRatingsDb(t);

            response = {
                ratings: [],
                items: []
            };

            if (!options.count) {

                filter.skip = PAGE_LIMIT * (page - 1);
                filter.limit = PAGE_LIMIT;

                db.find(query, filter).forEach(function (rating) {
                    item_ids.push(rating[t + '_id']);
                    response.ratings.push(rating);
                });

            } else {

                filter.limit = 200;

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
                    item_ids.push(rating[t + '_id']);
                    response.ratings.push(rating);
                }

            }

            if (response.ratings.length > 0) {
                var itemDb = NoFoodz.db.typeToDb(t);
                response.items = itemDb.find({_id: {$in: item_ids}}, {
                    fields: {
                        _id: 1,
                        name: 1,
                        brand_id: 1,
                        brand_view: 1
                    }
                }).fetch();

            }

        }

        return response;
    }
});
