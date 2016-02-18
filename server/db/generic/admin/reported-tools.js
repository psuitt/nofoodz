var MAX_LIMIT = 15;

Meteor.methods({

    findReportedItems: function (options) {

        check(options, {
            page: PageNumber,
            count: Match.Optional(Boolean)
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var user = Meteor.user();

        if (!NoFoodz.utils.user.isAdmin(user))
            throw new Meteor.Error(403, NoFoodz.messages.errors.ADMIN_TYPE);

        var query = {
            flags: {$in: [NoFoodz.consts.flags.REPORTED]}
        };

        var filter = {
            limit: MAX_LIMIT,
            skip: MAX_LIMIT * (options.page - 1),
            fields: {
                name: 1,
                brand_id: 1,
                brand_view: 1
            }
        };

        var response = {};

        // Return a response of reported items
        for (var type in NoFoodz.consts.db) {
            if (NoFoodz.consts.db.hasOwnProperty(type) && NoFoodz.consts.db.BRAND !== NoFoodz.consts.db[type]) {
                response[NoFoodz.consts.db[type] + 's'] = NoFoodz.db.typeToDb(NoFoodz.consts.db[type]).find(query, filter).fetch();
            }
        }

        return response;

    },

    removeItems: function (options) {

        check(options, {
            items: Array
        });

        _.each(options.items, function (obj, index) {
            check(obj, NullCheck);
            check(obj._id, NonEmptyStringNoSpaceCharacters);
            check(obj.type, FoodTypeCheck);
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var user = Meteor.user();

        if (!NoFoodz.utils.user.isAdmin(user))
            throw new Meteor.Error(403, NoFoodz.messages.errors.ADMIN_TYPE);

        for (var i = 0, len = options.items.length; i < len; i += 1) {

            var item = options.items[i];

            var db = NoFoodz.db.typeToDb(item.type);
            var dbRating = NoFoodz.db.typeToRatingsDb(item.type);
            var dbComments = NoFoodz.db.typeToCommentsDB(item.type);

            var dbItem = db.findOne({_id: item._id});

            dbRating.remove({item_id: item._id});
            dbComments.remove({item_id: item._id});
            db.remove({_id: item._id});

            if (dbItem) {

                var deleteBrand = true;

                var query = {
                    brand_id: dbItem.brand_id
                };

                var filter = {
                    fields: {
                        _id: 1
                    }
                };

                for (var type in NoFoodz.consts.db) {
                    if (NoFoodz.consts.db.hasOwnProperty(type) && NoFoodz.consts.db.BRAND !== NoFoodz.consts.db[type]) {
                        var one = NoFoodz.db.typeToDb(NoFoodz.consts.db[type]).findOne(query, filter);

                        if (one && one._id) {
                            deleteBrand = false;
                            break;
                        }
                    }
                }

                // Remove the brand if there are no more rating attached.
                if (deleteBrand) {
                    Brands.remove({_id: brand_id});
                }

            }

        }

    }

});