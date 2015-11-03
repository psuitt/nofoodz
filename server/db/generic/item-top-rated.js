/**
 * Created by Sora on 11/2/2015.
 */
Meteor.methods({

    itemTopRatedSearch: function (options) {

        check(options, {
            'type': TypeCheck
        });

        var filter = {
            fields: {
                _id: 1,
                name: 1,
                brand_id: 1,
                brand_view: 1,
                ratingtotal_calc: 1,
                ratingcount_calc: 1
            },
            sort: {
                ratingtotal_calc: -1,
                ratingcount_calc: -1
            },
            limit: 25
        }

        var db = NoFoodz.db.typeToDb(options.type);

        return db.find({ratingtotal_calc: {$gt: 0}}, filter).fetch();

    }

});
