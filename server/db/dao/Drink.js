/**
 * Created by Sora on 8/25/2015.
 */
Drink = function (name, brandId, brandName, keywords, tags, user) {

    this.name = name;
    this.brand_id = brandId;
    this.brand_view = brandName;
    this.keywords = keywords;
    this.tags = tags;
    this.user_id = user;
    this._id = Random.id();
    this.rating_calc = 0;
    this.ratingcount_calc = 0;
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

        this._id = product._id;
        this.name = product.name;
        this.brand_id = product.brand_id;
        this.brand_view = product.brand_view;
        this.keywords = product.keywords;
        this.tags = product.tags;
        this.user_id = product.user_id;
        this.rating_calc = product.rating_calc;
        this.ratingcount_calc = product.ratingcount_calc;
        this.date = product.date;

    }

};

