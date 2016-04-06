/**
 * Created by Sora on 2/29/2016.
 */
AbstractItem = class AbstractItem {

    constructor(db, name, brandId, brandName, keywords, tags, user, rating) {
        this.db = db;
        this.name = name;
        this.brand_id = brandId;
        this.brand_view = brandName;
        this.keywords = keywords;
        this.tags = tags;
        this.user_id = user;
        this._id = Random.id();
        this.rating_calc = rating ? rating : 0;
        // Calculated total number of raters
        this.ratingcount_calc = rating ? 1 : 0;
        // Calculated sum of all ratings
        this.ratingtotal_calc = rating ? rating : 0;
        this.date = Date.now();
    }

    insert() {

        this.db.insert({
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

    }

    updateRating() {

        this.db.update(this._id, {
            $set: {
                rating_calc: this.rating_calc
            }
        });

    }

    incrementRating(incCount, incTotal) {

        this.db.update(this._id, {
            $inc: {
                ratingcount_calc: incCount,
                ratingtotal_calc: incTotal
            }
        });

    }

    updateFields(dao) {

        if (dao) {
            for (var field in this) {
                if (dao.hasOwnProperty(field)) {
                    this[field] = dao[field];
                }
            }
        }

    }

    find(filter) {

        var item = this.db.findOne({_id: this._id}, filter);

        if (!item) {

            // Not found reset the id
            this._id = -1;

        } else {

            this.updateFields(item);

        }

        return item;

    }

};