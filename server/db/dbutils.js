/**
 * Created by Sora on 9/5/2015.
 */
NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.db = function () {
    return {

        typeToDao: function (type) {

            var o,
                t = type.toLowerCase();

            if (t === NoFoodz.consts.db.FOOD) {
                o = Food;
            } else if (t === NoFoodz.consts.db.DRINK) {
                o = Drink;
            } else if (t === NoFoodz.consts.db.PRODUCT) {
                o = Product;
            } else if (t === NoFoodz.consts.db.MEDIA) {
                o = Media;
            } else if (t === NoFoodz.consts.db.OTHER) {
                o = Other;
            } else {
                throw new Meteor.Error(500, 'A type is required to do a rating insert.');
            }

            return o;
        },

        typeToDb: function (type) {

            var db,
                t = type.toLowerCase();

            if (t === NoFoodz.consts.db.FOOD) {
                db = Foods;
            } else if (t === NoFoodz.consts.db.DRINK) {
                db = Drinks;
            } else if (t === NoFoodz.consts.db.PRODUCT) {
                db = Products;
            } else if (t === NoFoodz.consts.db.MEDIA) {
                db = Medias;
            } else if (t === NoFoodz.consts.db.OTHER) {
                db = Others;
            } else if (t === NoFoodz.consts.db.BRAND) {
                db = Brands;
            } else {
                throw new Meteor.Error(500, 'A type is required to get a database object.');
            }

            return db;
        },

        typeToRatingsDb: function (type) {

            var db,
                t = type.toLowerCase();

            if (t === NoFoodz.consts.db.FOOD) {
                db = FoodRatings;
            } else if (t === NoFoodz.consts.db.DRINK) {
                db = DrinkRatings;
            } else if (t === NoFoodz.consts.db.PRODUCT) {
                db = ProductRatings;
            } else if (t === NoFoodz.consts.db.MEDIA) {
                db = MediaRatings;
            } else if (t === NoFoodz.consts.db.OTHER) {
                db = OtherRatings;
            } else {
                throw new Meteor.Error(500, 'A type is required to do a rating insert.');
            }

            return db;
        },

        typeToCommentsDB: function (type) {

            switch (type.toLowerCase()) {
                case NoFoodz.consts.db.FOOD:
                    return FoodComments;
                case NoFoodz.consts.db.DRINK:
                    return DrinkComments;
                case NoFoodz.consts.db.PRODUCT:
                    return ProductComments;
                default:
                    break;
            }

        }
    };

}();