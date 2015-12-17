/**
 * Created by Sora on 8/25/2015.
 */
Rating = function (rating, userId, type) {

    this.rating = rating;
    this.user_id = userId;
    this._id = Random.id();
    this.item_id = false;
    this.itemname_view = '';
    this.itembrand_view = '';
    this.username_view = '';
    this.type = type;
    this.random = Math.random();
    this.comments = [];
    this.date = Date.now();

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

    Validator.validate(this, 'user_id', 'item_id', 'type');

    var query = {
        user_id: this.user_id,
        item_id: this.item_id
    };

    var db = NoFoodz.db.typeToRatingsDb(this.type);

    var rating = db.findOne(query, filter);

    // update the data to the current new data.
    if (!skipSet)
        this.updateFields(rating);

    return rating;

};

Rating.prototype.insert = function () {

    var db;
    var ratingObj = {
        _id: this._id,
        user_id: this.user_id,
        item_id: this.item_id,
        itemname_view: this.itemname_view,
        itembrand_view: this.itembrand_view,
        username_view: this.username_view,
        rating: this.rating,
        random: this.random,
        comments: this.comments,
        date: this.date
    };

    if (this.type) {
        db = NoFoodz.db.typeToRatingsDb(this.type);
    } else {
        throw new Meteor.Error(500, 'A type id is required to do a rating insert.');
    }

    return db.insert(ratingObj);

};

Rating.prototype.upsert = function () {

    var rating = this.findByUser({}, true),
        returnedObj = {previous: rating};

    if (rating) {

        var db = null;

        if (this.type) {
            db = NoFoodz.db.typeToRatingsDb(this.type);
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

Rating.prototype.updateComments = function () {

    Validator.validate(this, '_id', 'type', 'comments');

    var db = NoFoodz.db.typeToRatingsDb(this.type);

    db.update({_id: this._id}, {
        $set: {
            comments: this.comments,
            date: Date.now()
        }
    });

};