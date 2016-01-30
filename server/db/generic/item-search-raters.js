/**
 * Created by Sora on 12/6/2015.
 */
Meteor.methods({

    getAllRaters: function (options) {

        check(options, {
            page: PageNumber,
            type: TypeCheck,
            _id: NonEmptyStringNoSpaceCharacters,
            user_id: Match.Optional(NonEmptyStringNoSpaceCharacters)
        });

        var ratingDB = NoFoodz.db.typeToRatingsDb(options.type);

        var ratingQuery = {
            item_id: options._id,
            rating: {$gt: 0}
        };

        var ratingFilter = {

            limit: 25,
            skip: 25 * (options.page - 1),
            fields: {
                rating: 1,
                user_id: 1,
                username_view: 1
            }

        };

        // If there is a user id get the followers.
        if (options.user_id) {

            var query = {
                follower_id: options.user_id
            };

            var filter = {
                fields: {
                    user_id: 1
                }
            };

            var followers = Followers.find(query, filter).fetch();

            var inList = [];

            _.each(followers, function (follower, key) {
                inList.push(follower.user_id);
            });

            ratingQuery.user_id = {$in: inList};

        }

        return ratingDB.find(ratingQuery, ratingFilter).fetch();

    }

});