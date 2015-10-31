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
            } else {
                throw new Meteor.Error(500, 'A type is required to do a rating insert.');
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
            } else {
                throw new Meteor.Error(500, 'A type is required to do a rating insert.');
            }

            return db;
        },

        getCommentsDB: function (type) {

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