Meteor.startup(function () {

    /*
     var myjson = {};
     myjson = JSON.parse(Assets.getText("data/words.json"));

     if (myjson && myjson.data) {
     for (var i = 0, l = myjson.data.length; i < l ; i+= 1) {
     if (!Words.findOne({word: myjson.data[i].word})) {
     Words.insert({word: myjson.data[i].word});
     }
     }
     }
     */
    var setting = Settings.findOne({'_type': 'version'});

    if (!setting || setting.version !== 'alpha-1.2.1') {
        Settings.upsert({'_type': 'version'}, {
            '_type': 'version',
            'version': 'alpha-1.2.1'
        });
        runBatchFixes();
    }

});


var query = function (item) {
    return {item_id: item._id};
};

var update = function (item) {
    return {
        $set: {
            brand_id: item.brand_id,
            name_view: item.name,
            brand_view: item.brand_view
        }
    };
};

var runBatchFixes = function () {

    var filter = {multi: true};

    Foods.find({}).forEach(function (item) {

        FoodRatings.update(query(item), update(item), filter);

    });

    Drinks.find({}).forEach(function (item) {

        DrinkRatings.update(query(item), update(item), filter);

    });

    Products.find({}).forEach(function (item) {

        ProductRatings.update(query(item), update(item), filter);

    });

};
