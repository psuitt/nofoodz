List = function (name, user, items) {

    this._id = Random.id();
    this.name = name;
    this.user_id = user;
    this.date = Date.now();
    this.items = items ? items : [];

};

List.prototype.insert = function () {

    List.insert({
        _id: this._id,
        name: this.name,
        user_id: this.user_id,
        date: this.date,
        items: this.items
    });

};

List.prototype.updateFields = function (dao) {

    if (dao) {
        for (var field in this) {
            if (dao.hasOwnProperty(field)) {
                this[field] = dao[field];
            }
        }
    }

};

List.prototype.find = function (filter) {

    var item = List.findOne({_id: this._id}, filter);

    if (!item) {

        // Not found reset the id
        this._id = -1;

    } else {

        this.updateFields(item);

    }

    return item;

};
