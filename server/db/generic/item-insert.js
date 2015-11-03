/**
 * Created by Sora on 8/22/2015.
 */
Meteor.methods({

    createItems: function (products) {

        var response = {},
            userId = this.userId;

        if (!userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);
        if (NoFoodz.utils.user.isMod(Meteor.user()))
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);

        check(products, ProductsArrayCheck);

        _.each(products, function (brand) {

            var brandDao = new Brand(brand.brand, userId, false, false),
                insertFunction;

            brandDao.insert();

            brand._id = brandDao._id;

            switch (brand.type.toLowerCase()) {
                case NoFoodz.consts.db.FOOD:
                    insertFunction = insertFood;
                    break;
                case NoFoodz.consts.db.DRINK:
                    insertFunction = insertDrink;
                    break;
                case NoFoodz.consts.db.PRODUCT:
                    insertFunction = insertProduct;
                    break;
                default:
                    break;
            }

            _.each(brand.items, function (item) {

                var keywords = NoFoodz.utils.Tokenize(brand.brand + " " + item.name);

                Meteor.call('validate', keywords);

                insertFunction(brand, item, keywords, userId);

            });

        });

        if (products.length === 1 && products[0].items.length === 1) {
            response._id = products[0].items[0]._id;
        }

        return response;

    }

});

var insertFood = function (brand, item, keywords, userId) {

    var foodDao = new Food(item.name, brand._id, brand.brand, keywords, item.tags, userId, item.rating);
    foodDao.insert();

    if (item.rating) {
        var ratingDao = new Rating(item.rating, userId);
        ratingDao.food_id = foodDao._id;
        ratingDao.insert();
    }

    item._id = foodDao._id;

};

var insertDrink = function (brand, item, keywords, userId) {

    var drinkDao = new Drink(item.name, brand._id, brand.brand, keywords, item.tags, userId, item.rating);
    drinkDao.insert();

    if (item.rating) {
        var ratingDao = new Rating(item.rating, userId);
        ratingDao.drink_id = drinkDao._id;
        ratingDao.insert();
    }

    item._id = drinkDao._id;

};

var insertProduct = function (brand, item, keywords, userId) {

    var productDao = new Product(item.name, brand._id, brand.brand, keywords, item.tags, userId, item.rating);
    productDao.insert();

    if (item.rating) {
        var ratingDao = new Rating(item.rating, userId);
        ratingDao.product_id = productDao._id;
        ratingDao.insert();
    }

    item._id = productDao._id;

};
