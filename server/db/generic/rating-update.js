/**
 * Created by Sora on 9/5/2015.
 */
Meteor.methods({

    updateRating: function (options) {

        check(options, {
            rating: RatingCheck,
            type: TypeCheck,
            _id: NonEmptyStringNoSpaceCharacters
        });

        var currentUserId = this.userId;

        if (!currentUserId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var user = Meteor.users.findOne({_id: this.userId}, {fields: {
            roles: 1,
            "profile.name": 1,
            "profile.bonusHearts": 1
        }});

        if (!NoFoodz.utils.user.isNormalUser(user))
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);

        if (options.rating > 5) {

            var bonusHearts = user.profile.bonusHearts;

            if (bonusHearts < 1) {
                throw new Meteor.Error(500, "You can not rate this above a 5");
            }

        }

        // Find the item
        var func = NoFoodz.db.typeToDao(options.type),
            itemDao = new func();

        itemDao._id = options._id;

        var item = itemDao.find();

        var ratingDiff = options.rating,
            countDiff = 0;

        var rating = new Rating(options.rating, this.userId, options.type);

        // Set the rating id
        rating.item_id = options._id;
        // Set the rating for updating
        rating.rating = options.rating;
        rating.brand_id = item.brand_id;
        rating.name_view = item.name;
        rating.brand_view = item.brand_view;
        rating.username_view = user.profile.name;

        // Update the rating
        var upsertObj = rating.upsert(),
            userRating = upsertObj.previous;

        if (!userRating) {

            if (options.rating === 6)
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": -1}});

            // No rating prior so if greater than 0 count this.
            if (options.rating > 0)
                countDiff = 1;

        } else {

            // No adjustments are needed.
            ratingDiff -= userRating.rating;

            if (userRating.rating === 6 && options.rating !== 6) {
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": 1}});
            } else if (userRating.rating !== 6 && options.rating === 6) {
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": -1}});
            }

            if (userRating.rating > 0 && options.rating == 0) {
                // If previous was higher than 0 and new is 0 decrement.
                countDiff = -1;
            } else if (userRating.rating === 0 && options.rating > 0) {
                // If the previous was 0 and the new is greater increment.
                countDiff = 1;
            }

        }

        itemDao.incrementRating(countDiff, ratingDiff);

        itemDao.ratingcount_calc = item.ratingcount_calc + countDiff;
        itemDao.ratingtotal_calc = item.ratingtotal_calc + ratingDiff;

        itemDao.rating_calc = NoFoodz.utils.calculateRating(itemDao);
        itemDao.updateRating();

        if (upsertObj.isInsert) {
            var notification = {
                _id: options._id,
                type: options.type,
                user_id: currentUserId,
                rating: options.rating
            };
            Meteor.call('createNotification', notification, function (err, data) {
                if (err) {
                    console.log('Notification failed ' + EJSON.stringify(notification) + ' err: ' + err);
                }
            });
        }

        return {ratingtotal_calc: itemDao.ratingtotal_calc, ratingcount_calc: itemDao.ratingcount_calc};

    }

});