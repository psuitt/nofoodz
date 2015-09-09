/**
 * Created by Sora on 8/25/2015.
 */
Drink = function (name, brandId, brandName, keywords, tags, user, rating) {

    this.name = name;
    this.brand_id = brandId;
    this.brand_view = brandName;
    this.keywords = keywords;
    this.tags = tags;
    this.user_id = user;
    this._id = Random.id();
    this.rating_calc = rating ? rating : 0;
    this.ratingcount_calc = rating ? 1 : 0;
    this.ratingtotal_calc = 0;
    this.date = Date.now();

};

Drink.prototype.insert = function () {

    Drinks.insert({
        _id: this._id,
        name: this.name,
        brand_id: this.brand_id,
        brand_view: this.brand_view,
        keywords: this.keywords,
        tags: this.tags,
        rating_calc: this.rating_calc,
        ratingcount_calc: this.ratingcount_calc,
        ratingtotal_calc: this.ratingtotal_calc,
        user_id: this.user_id,
        date: this.date
    });

};

Drink.prototype.find = function (filter) {

    var drink = Drinks.findOne({_id: this._id}, filter);

    if (!drink) {

        // Not found reset the id
        this._id = -1;

    } else {

        this._id = drink._id;
        this.name = drink.name;
        this.brand_id = drink.brand_id;
        this.brand_view = drink.brand_view;
        this.keywords = drink.keywords;
        this.tags = drink.tags;
        this.user_id = drink.user_id;
        this.rating_calc = drink.rating_calc;
        this.ratingcount_calc = drink.ratingcount_calc;
        this.date = drink.date;

    }

    return drink;

};

