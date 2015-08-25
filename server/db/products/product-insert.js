/**
 * Created by Sora on 8/22/2015.
 */
Meteor.methods({

    createProducts: function (products) {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);
        if (NoFoodz.utils.user.isMod(Meteor.user()))
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);

        check(products, ProductsArrayCheck);

        var tokens = NoFoodz.utils.Tokenize(options.name + " " + options.brand);

        Meteor.call('validate', tokens);

        var brand = Brands.findOne({name: options.brand});

        // Matching name exists merge
        if (brand) {
            brand_id = brand._id;
        } else {
            // Create a new one
            brand_id = Brands.insert({
                _id: Random.id(),
                name: options.brand,
                locations: [], //[address], Empty for now.
                date: Date.now(),
                user_id: this.userId
            });
        }

        var ratingObj = {
            _id: Random.id(),
            user_id: this.userId,
            rating: options.rating,
            date: Date.now()
        };

        var fooddrink = {
            _id: options._id,
            brand_id: brand_id,
            brand_view: options.brand,
            address_view: options.address,
            keywords: tokens,
            name: options.name,
            rating_calc: options.rating,
            ratingcount_calc: 1,
            date: Date.now(),
            user_id: this.userId
        };

        switch (options.type) {
            case "food":
                Foods.insert(fooddrink);
                ratingObj.food_id = options._id;
                countryStat.food_id = options._id;
                break;
            case "drink":
                Drinks.insert(fooddrink);
                ratingObj.drink_id = options._id;
                countryStat.drink_id = options._id;
                break;
            default:
                throw new Meteor.Error(501, "The server does not support this functionality");
        }

        var rating_Id = NoFoodz.rating.create(ratingObj);

        if (countryStat) {
            Meteor.call('addCountry', countryStat);
        }

        return options._id;

    }

});
