/**
 * Created by Sora on 8/25/2015.
 */
Comment = function (item_id, type, comment, user) {

    this._id = Random.id();
    // Id of the product or food
    this.item_id = item_id;
    // Type of item
    this.type = type;
    // Comments array
    this.comment = comment;
    this.user_id = user;
    // How many times this was listed
    this.value = 1;
    this.date = Date.now();
    this.random = Math.random();

};

Comment.prototype.updateFields = function (obj) {

    if (obj) {
        for (var field in this) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }

};

Comment.prototype.findByUser = function (filter, skipSet) {

    var query = {
        item_id: this.item_id,
        type: this.type,
        comment: {$regex: new RegExp(this.comment, "i")}
    };

    Validator.validate(this, 'item_id', 'type', 'comment');

    var db = NoFoodz.db.typeToCommentsDB(this.type);
    var comment = db.findOne(query, filter);

    // update the data to the current new data.
    if (!skipSet)
        this.updateFields(comment);

    return comment;

};

Comment.prototype.insert = function () {

    Validator.validate(this, 'item_id', 'type', 'comment');

    var objToInsert = {
        _id: this._id,
        item_id: this.item_id,
        type: this.type,
        comment: this.comment,
        value: this.value,
        user_id: this.user_id,
        date: this.date,
        random: this.random
    };

    var db = NoFoodz.db.typeToCommentsDB(this.type);

    return db.insert(objToInsert);

};

Comment.prototype.upsert = function () {

    Validator.validate(this, 'item_id', 'type', 'comment');

    var comment = this.findByUser({}, true),
        returnedObj = {previous: comment};

    if (comment) {

        var db = NoFoodz.db.typeToCommentsDB(this.type);

        db.update({
            _id: comment._id
        }, {
            $inc: {'value': 1},
            $set: {'date': Date.now()}
        });

        returnedObj.isInsert = false;

    } else {

        returnedObj.isInsert = true;
        this.insert.call(this);

    }

    return returnedObj;

};