/**
 * Created by Sora on 8/22/2015.
 */
Meteor.methods({

    createItems: function (products) {

        var response = {},
            userId = this.userId;

        if (!userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var user = Meteor.users.findOne({_id: userId}, {fields: {
            roles: 1
        }});

        check(products, ProductsArrayCheck);

        if (!NoFoodz.utils.user.isMod(user) && products.length > 1)
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);
        if (!NoFoodz.utils.user.isNormalUser(user))
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);

        _.each(products, function (brand) {

            if (brand.brand_id) {

                brand._id = brand.brand_id;

            } else {

                var brandDao = new Brand(brand.brand, userId, false, false);

                brandDao.insert();

                brand._id = brandDao._id;

            }

            _.each(brand.items, function (item) {

                var keywords = NoFoodz.utils.Tokenize(brand.brand + " " + item.name);

                Meteor.call('validate', keywords);

                var func = NoFoodz.db.typeToDao(brand.type);
                var dao = new func(item.name, brand._id, brand.brand, keywords, item.tags, userId, item.rating);
                dao.insert();

                if (item.rating) {
                    var ratingDao = new Rating(item.rating, userId, brand.type);
                    ratingDao.item_id = dao._id;
                    ratingDao.itemname_view = item.name;
                    ratingDao.itembrand_view = brand.brand;
                    ratingDao.insert();
                }

                item._id = dao._id;

            });

        });

        if (products.length === 1 && products[0].items.length === 1) {
            response._id = products[0].items[0]._id;
        }

        return response;

    }

});
