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

        console.log(options);

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var rating = new Rating(options.rating, this.userId);

        // Set the rating id
        rating[options.type.toLowerCase() + '_id'] = options._id;

        var userRating = rating.findByUser(),
            user = Meteor.users.findOne({_id: this.userId}),
            bonusHearts = user.profile.bonusHearts;

        if (!user.profile.bonusHearts) {
            Meteor.users.update({_id: this.userId}, {$set: {"profile.bonusHearts": 10}});
            bonusHearts = 10;
        }

        if (bonusHearts < 1 && options.rating > 5) {
            throw new Meteor.Error(500, "You can not rate this above a 5");
        }

        var ratingDiff = options.rating,
            countDiff = 1;

        // Set the rating for updating
        rating.rating = options.rating;
        // Update the rating
        rating.upsert();

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

        }

        //Recalculate Rating total
        var func = NoFoodz.db.typeToDao(options.type),
            itemDao = new func();

        console.log('Item Dao ' + EJSON.stringify(itemDao));

        itemDao._id = options._id;

        var item = itemDao.find(),
            total = item.ratingtotal_calc;

        console.log('Item Dao ' + EJSON.stringify(itemDao));

        total += ratingDiff;
        count = item.ratingcount_calc + countDiff;

        itemDao.ratingtotal_calc = total;
        itemDao.ratingcount_calc = count;

        itemDao.updateRating();

        return {ratingtotal_calc: itemDao.ratingtotal_calc, ratingcount_calc: itemDao.ratingcount_calc};

    }

});