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

        if (!userRating) {

            if (options.rating === 6)
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": -1}});

            var rating_Id = NoFoodz.rating.create({
                _id: Random.id(),
                drink_id: options._id,
                user_id: this.userId,
                rating: options.rating,
                date: Date.now()
            });

        } else {

            // No adjustments are needed.
            countDiff = 0;
            ratingDiff -= userRating.rating;

            if (userRating.rating === 6 && options.rating !== 6) {
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": 1}});
            } else if (userRating.rating !== 6 && options.rating === 6) {
                Meteor.users.update({_id: this.userId}, {$inc: {"profile.bonusHearts": -1}});
            }
            NoFoodz.rating.updateOne(userRating, {$set: {rating: options.rating, date: Date.now()}}, this.userId);
        }

        //Recalculate Rating total
        var drink = Drinks.findOne({_id: options._id}),
            total = 0;

        if (!drink.ratingtotal_calc) {
            total = drink.rating_calc * drink.ratingcount_calc;
        } else {
            total = drink.ratingtotal_calc;
        }

        total += ratingDiff;
        count = drink.ratingcount_calc + countDiff

        var avg = (total / parseFloat(count)).toFixed(2);

        if (avg.lastIndexOf('0') === 3) {
            avg = avg.substring(0, 3);
            avg = avg.replace('.0', '');
        }

        Drinks.update(options._id, {
            $set: {
                rating_calc: avg,
                ratingtotal_calc: total,
                ratingcount_calc: count
            }
        });

        return {rating_calc: avg, ratingcount_calc: count};

    }

});