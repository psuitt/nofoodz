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

        console.log('Starting search.');
        console.log('Item is a ' + options.type);
        switch (options.type) {
            case NoFoodz.consts.db.FOOD:
            case NoFoodz.consts.db.DRINK:
            case NoFoodz.consts.db.PRODUCT:
                var func = NoFoodz.db.typeToDao(options.type),
                    itemDao = new func();

                itemDao._id = options._id;

                response.item = itemDao.find(filter);

                console.log(response.item);

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