/**
 * Created by Sora on 8/25/2015.
 */
Rating = function (rating, userId, type) {

    this.rating = rating;
    this.user_id = userId;
    this._id = Random.id();
    this.date = Date.now();
    this.item_id = false;
    this.type = type;
    this.random = Math.random();

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

    if (!this.user_id) {
        throw new Meteor.Error(500, 'A user id is required to do a rating insert.');
    }

    var query = {
        user_id: this.user_id,
        item_id: this.item_id
    };

    var db;

    if (this.type) {
        db = NoFoodz.db.typeToRatingsDb(this.type);
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

    var db;
    var ratingObj = {
        _id: this._id,
        user_id: this.user_id,
        item_id: this.item_id,
        rating: this.rating,
        date: this.date,
        random: this.random
    };

    if (this.type) {
        db = NoFoodz.db.typeToRatingsDb(this.type);
    } else {
        throw new Meteor.Error(500, 'A type id is required to do a rating insert.');
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

        if (this.type) {
            db = NoFoodz.db.typeToRatingsDb(this.type);
        } else {
            throw new Meteor.Error(500, 'A type is required to do a rating insert.');
        }

        db.update({_id: rating._id}, {
            $set: {
                rating: this.rating,
                date: Date.now(),
                random: Math.random()
            }
        });
        returnedObj.isInsert = false;

    } else {

        returnedObj.isInsert = true;
        this.insert.call(this);

    }

    return returnedObj;

};