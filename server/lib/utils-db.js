/**
 * Created by Sora on 8/26/2015.
 */
NoFoodz.utils = typeof NoFoodz.utils === 'undefined' ? {} : NoFoodz.utils;

NoFoodz.utils.db = {

    getDBDao: function (type) {
        switch (type.toLowerCase()) {
            case NoFoodz.consts.db.FOOD:
                return Food;
            case NoFoodz.consts.db.DRINK:
                return Drink;
            case NoFoodz.consts.db.PRODUCT:
                return Product;
            default:
                break;
        }
    },

    getDB: function (type) {

        switch (type.toLowerCase()) {
            case NoFoodz.consts.db.FOOD:
                return Foods;
            case NoFoodz.consts.db.DRINK:
                return Drinks;
            case NoFoodz.consts.db.PRODUCT:
                return Products;
            default:
                break;
        }

    }
};
