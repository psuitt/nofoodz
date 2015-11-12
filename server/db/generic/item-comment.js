Meteor.methods({

    findCommentsForItem: function (options) {

        check(options, {
            item_id: NonEmptyString,
            type: TypeCheck
        });

        var response = [];

        var db = NoFoodz.db.typeToCommentsDB(options.type);

        var query = {
            item_id: options.item_id,
            type: options.type,
            value: {$gt: 0}
        };
        var filter = {
            fields: {
                comment: 1,
                value: 1
            },
            sort: {
                value: -1
            },
            limit: 25
        };

        response = db.find(query, filter).fetch();

        return response;

    },

    updateComments: function (options) {

        check(options, {
            item_id: NonEmptyString,
            type: TypeCheck,
            comments: CommentsCheck
        });

        var userId = this.userId;
        var userRating = new Rating(0, userId);

        userRating.item_id = options.item_id;
        userRating.type = options.type;

        userRating.findByUser({
            fields: {
                comments: 1
            }
        });

        if (userRating._id) {

            var removalList = [];
            var db = NoFoodz.db.typeToCommentsDB(options.type);

            if (userRating.comments)
                _.each(userRating.comments, function (comment, index) {

                    if (options.comments.indexOf(comment) === -1) {

                        // Add to decrease.
                        removalList.push(comment);

                    }

                });

            _.each(options.comments, function (comment, index) {

                if (!userRating.comments || userRating.comments.indexOf(comment) === -1) {

                    var commentDao = new Comment();

                    commentDao.item_id = options.item_id;
                    commentDao.type = options.type;
                    commentDao.comment = comment;
                    commentDao.user_id = userId;

                    commentDao.upsert();

                }

            });

            // Decrease the user rating comment
            db.update({
                    item_id: options.item_id,
                    type: options.type,
                    comment: {$in: removalList}
                }, {
                    $inc: {'value': -1},
                    $set: {'date': Date.now()}
                },
                {multi: true});

            userRating.comments = options.comments;

            userRating.updateComments();

        }

    }

});