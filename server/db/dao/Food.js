/**
 * Created by Sora on 8/25/2015.
 */
Food = function (name, brandId, brandName, keywords, tags, user, rating) {

    this.name = name;
    this.brand_id = brandId;
    this.brand_view = brandName;
    this.keywords = keywords;
    this.tags = tags;
    this.user_id = user;
    this._id = Random.id();
    this.rating_calc = rating ? rating : 0;
    this.ratingcount_calc = rating ? 1 : 0;
    this.date = Date.now();

};

Food.prototype.insert = function () {

    Foods.insert({
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

Food.prototype.find = function (filter) {

    var food = Foods.findOne({_id: this._id}, filter);

    if (!food) {

        // Not found reset the id
        this._id = -1;

    } else {

        this._id = food._id;
        this.name = food.name;
        this.brand_id = food.brand_id;
        this.brand_view = food.brand_view;
        this.keywords = food.keywords;
        this.tags = food.tags;
        this.user_id = food.user_id;
        this.rating_calc = food.rating_calc;
        this.ratingcount_calc = food.ratingcount_calc;
        this.date = food.date;

    }

    return food;

};
