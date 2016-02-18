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
            sort: {name: -1},
            fields: {
                _id: 1,
                name: 1,
                brand_id: 1,
                brand_view: 1,
                ratingtotal_calc: 1,
                ratingcount_calc: 1,
                info: 1,
                images: 1
            }
        };

        switch (options.type) {
            case NoFoodz.consts.db.FOOD:
            case NoFoodz.consts.db.DRINK:
            case NoFoodz.consts.db.PRODUCT:
            case NoFoodz.consts.db.MEDIA:
            case NoFoodz.consts.db.OTHER:
                var func = NoFoodz.db.typeToDao(options.type),
                    itemDao = new func();

                itemDao._id = options._id;

                response.item = itemDao.find(filter);

                if (this.userId) {
                    var rating = new Rating();
                    rating.item_id = options._id;
                    rating.type = options.type.toLowerCase();
                    rating.user_id = this.userId;
                    response.userRating = rating.findByUser({fields: {rating: 1, comments: 1}});
                }

                break;
            default:
                throw new Meteor.Error(501, "The server does not support this functionality");
        }

        return response;
    }

});