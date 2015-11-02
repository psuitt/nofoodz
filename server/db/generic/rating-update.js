/**
 * Created by Sora on 9/5/2015.
 */
Meteor.methods({

    updateRating: function (options) {

        check(options, {
            rating: RatingCheck,
            type: TypeCheck,
            _id: NonEmptyString
        });

        var currentUserId = this.userId;

        console.log(options);

        if (!currentUserId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var user = Meteor.users.findOne({_id: this.userId}),
            bonusHearts = user.profile.bonusHearts;

        if (bonusHearts < 1 && options.rating > 5) {
            throw new Meteor.Error(500, "You can not rate this above a 5");
        }

        var ratingDiff = options.rating,
            countDiff = options.rating > 0 ? 1 : 0;

        var rating = new Rating(options.rating, this.userId);

        // Set the rating id
        rating[options.type.toLowerCase() + '_id'] = options._id;
        // Set the rating for updating
        rating.rating = options.rating;

        // Update the rating
        var upsertObj = rating.upsert(),
            userRating = upsertObj.previous;

        if (!userRating) {

            if (options.rating === 6)
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": -1}});

        } else {

            // No adjustments are needed.
            countDiff = 0;
            ratingDiff -= userRating.rating;

            if (userRating.rating === 6 && options.rating !== 6) {
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": 1}});
            } else if (userRating.rating !== 6 && options.rating === 6) {
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": -1}});
            }

            if (userRating.rating > 0 && options.rating == 0) {
                countDiff = -1;
            } else if (userRating.rating === 0 && options.rating > 0) {
                countDiff = 1;
            }

        }

        //Recalculate Rating total
        var func = NoFoodz.db.typeToDao(options.type),
            itemDao = new func();

        itemDao._id = options._id;

        var item = itemDao.find(),
            total = item.ratingtotal_calc ? item.ratingtotal_calc : 0,
            count = item.ratingcount_calc + countDiff;

        console.log('Item Dao ' + EJSON.stringify(itemDao));

        if (count > 0) {

            total += ratingDiff;
            itemDao.ratingtotal_calc = total;
            itemDao.ratingcount_calc = count;

        } else if (options.rating === 0) {
            itemDao.ratingtotal_calc = options.rating;
            itemDao.ratingcount_calc = 0;
        } else {
            itemDao.ratingtotal_calc = options.rating;
            itemDao.ratingcount_calc = 1;
        }

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