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
    // Calculated total number of raters
    this.ratingcount_calc = rating ? 1 : 0;
    // Calculated sum of all ratings
    this.ratingtotal_calc = rating ? rating : 0;
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
        ratingcount_calc: this.ratingcount_calc,
        ratingtotal_calc: this.ratingtotal_calc,
        user_id: this.user_id,
        date: this.date
    });

};

Food.prototype.updateRating = function () {

    Products.update(this._id, {
        $set: {
            ratingtotal_calc: this.ratingtotal_calc,
            ratingcount_calc: this.ratingcount_calc
        }
    });

};

Food.prototype.updateFields = function (dao) {

    if (dao) {
        for (var field in this) {
            if (dao.hasOwnProperty(field)) {
                this[field] = dao[field];
            }
        }
    }

};

Food.prototype.find = function (filter) {

    var item = Foods.findOne({_id: this._id}, filter);

    if (!item) {

        // Not found reset the id
        this._id = -1;

    } else {

        this.updateFields(item);

    }

    return item;

};
