/**
 * Created by Sora on 8/25/2015.
 */
Brand = function (name, user, id, date) {

    this.name = name;
    this.user_id = user;
    this._id = id ? id : Random.id();
    this.date = date ? date : Date.now();

};

Brand.prototype.insert = function () {

    var brand = Brands.findOne({name: this.name});

    if (brand) {

        this._id = brand._id;

    } else {

        Brands.insert({
            _id: this._id,
            name: this.name,
            date: this.date,
            user_id: this.user_id
        });

    }

};