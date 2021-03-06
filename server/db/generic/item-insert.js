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
            roles: 1,
            'profile.name': 1
        }});

        check(products, ProductsArrayCheck);

        if (products.length > 1) {
            if (!NoFoodz.utils.user.isMod(user) && !NoFoodz.utils.user.isAdmin(user))
                throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);
        } else if (!NoFoodz.utils.user.isMod(user) && !NoFoodz.utils.user.isAdmin(user) && !NoFoodz.utils.user.isNormalUser(user)) {
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);
        }

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
                    ratingDao.brand_id = brand._id;
                    ratingDao.name_view = item.name;
                    ratingDao.brand_view = brand.brand;
                    ratingDao.username_view = user.profile.name;
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
