/**
 * Created by Sora on 11/2/2015.
 */
Meteor.methods({

    /**
     * Random requires and index to work.
     *
     * @param options
     * @returns {boolean}
     */
    getRandom: function (options) {

        check(options, {
            type: TypeCheck,
            brand_id: Match.Optional(NonEmptyStringNoSpaceCharacters)
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var response = false,
            t = options.type.toLowerCase();

        var query = {
            user_id: options.user_id ? options.user_id : this.userId,
            rating: {$gt: 2},
            random: {$gte: Math.random()}
        };

        if (options.brand_id) {
            query.brand_id = options.brand_id;
        }

        var db = NoFoodz.db.typeToRatingsDb(t);

        response = {
            rating: false,
            item: false
        };

        var rating = db.findOne(query);

        if (!rating) {
            query.random = {$lte: query.random['$gte']};
            rating = db.findOne(query);
        }

        if (!rating) {
            delete query.random;
            rating = db.findOne(query);
        }

        response.rating = rating;

        if (rating) {
            var itemDb = NoFoodz.db.typeToDb(t);
            response.item = itemDb.findOne({_id: rating.item_id}, {
                fields: {
                    _id: 1,
                    name: 1,
                    brand_id: 1,
                    brand_view: 1
                }
            });
        }

        return response;
    }
});
