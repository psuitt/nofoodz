Meteor.methods({

    getItemById: function (options) {

        check(options, {
            _id: NonEmptyStringNoSpaceCharacters,
            type: TypeCheck
        });

        var response = {};

        var query = {
            _id: options._id
        };

        var filter = {
            sort: {name: -1}
        };

        filter = _.extend(filter, NoFoodz.consts.filters.HIDDEN_FOODS);

        switch (options.type) {
            case NoFoodz.consts.db.FOOD:
                response.item = Foods.findOne(query, filter);
                if (this.userId)
                    response.userRating = Ratings.findOne({
                        user_id: this.userId,
                        food_id: options._id
                    }, {fields: {rating: 1}});
                break;
            case NoFoodz.consts.db.DRINK:
                response.item = Drinks.findOne(query, filter);
                if (this.userId)
                    response.userRating = Ratings.findOne({
                        user_id: this.userId,
                        drink_id: options._id
                    }, {fields: {rating: 1}});
                break;
            case NoFoodz.consts.db.PRODUCT:
                var product = new Product();
                product._id = options._id;
                response.item = product.find(filter);
                if (this.userId)
                    var rating = new Rating();
                rating.product_id = options._id;
                rating.user_id = this.userId;
                response.userRating = rating.findByUser({fields: {rating: 1}});
                break;
            default:
                throw new Meteor.Error(501, "The server does not support this functionality");
        }

        return response;
    }

});