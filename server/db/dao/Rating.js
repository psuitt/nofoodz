/**
 * Created by Sora on 8/25/2015.
 */
Rating = function (rating, userId) {

    this.rating = rating;
    this.user_id = userId;
    this._id = Random.id();
    this.date = Date.now();
    this.food_id = false;
    this.drink_id = false;
    this.product_id = false;

};

Rating.prototype.updateFields = function (rating) {

    if (rating) {
        for (var field in this) {
            if (rating.hasOwnProperty(field)) {
                this[field] = rating[field];
            }
        }
    }

};

Rating.prototype.findByUser = function (filter, skipSet) {

    var query = {
        user_id: this.user_id
    };

    if (!this.user_id) {
        throw new Meteor.Error(500, 'A user id is required to do a rating insert.');
    }

    if (this.food_id) {
        query.food_id = this.food_id;
        db = FoodRatings;
    } else if (this.drink_id) {
        query.drink_id = this.drink_id;
        db = DrinkRatings;
    } else if (this.product_id) {
        query.product_id = this.product_id;
        db = ProductRatings;
    } else {
        throw new Meteor.Error(500, 'A type id is required to do a rating insert.');
    }

    console.log('Rating query ' + EJSON.stringify(query));
    var rating = db.findOne(query, filter);

    // update the data to the current new data.
    if (!skipSet)
        this.updateFields(rating);

    console.log('Rating found ' + EJSON.stringify(rating));

    return rating;

};

Rating.prototype.insert = function () {

    var db = null;
    var ratingObj = {
        _id: this._id,
        user_id: this.user_id,
        rating: this.rating,
        date: this.date
    };

    if (this.food_id) {
        ratingObj.food_id = this.food_id;
        db = FoodRatings;
    } else if (this.drink_id) {
        ratingObj.drink_id = this.drink_id;
        db = DrinkRatings;
    } else if (this.product_id) {
        ratingObj.product_id = this.product_id;
        db = ProductRatings;
    } else {
        throw new Meteor.Error(500, 'A type is required to do a rating insert.');
    }

    console.log('Inserting new rating ' + EJSON.stringify(ratingObj));

    return db.insert(ratingObj);

};

Rating.prototype.upsert = function () {

    var rating = this.findByUser({}, true),
        returnedObj = {previous: rating};

    if (rating) {

        console.log('Updating rating ' + EJSON.stringify(rating));
        console.log('Updating rating updated to ' + EJSON.stringify(this));

        var db = null;

        if (this.food_id) {
            db = FoodRatings;
        } else if (this.drink_id) {
            db = DrinkRatings;
        } else if (this.product_id) {
            db = ProductRatings;
        } else {
            throw new Meteor.Error(500, 'A type is required to do a rating insert.');
        }

        db.update({_id: rating._id}, {
            $set: {
                rating: this.rating,
                date: Date.now()
            }
        });
        returnedObj.isInsert = false;

    } else {

        returnedObj.isInsert = true;
        this.insert.call(this);

    }

    return returnedObj;

};