/**
 * Created by Sora on 8/25/2015.
 */
Rating = function (rating, userId) {

    this.rating = rating;
    this.user_id = userId;
    this._id = Random.id();
    this.date = Date.now();

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
        db = Ratings;
    } else if (this.drink_id) {
        ratingObj.drink_id = this.drink_id;
        db = Ratings;
    } else if (this.product_id) {
        ratingObj.product_id = this.product_id;
        db = ProductsRatings;

    } else {
        throw new Meteor.Error(500, 'A type is required to do a rating insert.');
    }

    db.insert(ratingObj);

};

Rating.prototype.findByUser = function () {

    var query = {
        user_id: this.userId,
    };

    if (this.food_id) {
        query.food_id = this.food_id;
        db = Ratings;
    } else if (this.drink_id) {
        query.drink_id = this.drink_id;
        db = Ratings;
    } else if (this.product_id) {
        query.product_id = this.product_id;
        db = ProductsRatings;
    } else {
        throw new Meteor.Error(500, 'A type is required to do a rating insert.');
    }

    var rating = Ratings.findOne(query, {fields: {rating: 1}});

    return rating;

};