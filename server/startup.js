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

    if (!setting || setting.version !== 'alpha-1.4.0') {
        Settings.upsert({'_type': 'version'}, {
            '_type': 'version',
            'version': 'alpha-1.4.0'
        });
        runBatchFixes();
    }

});


var query = function (item) {
    return {_id: item._id};
};

var update = function (item) {
    return {
        $unset: {
            rating: ''
        },
        $set: {
            rating_calc: NoFoodz.utils.calculateRating(item)
        }
    };
};

var runBatchFixes = function () {

    var filter = {};

    Foods.find({}).forEach(function (item) {

        Foods.update(query(item), update(item), filter);

    });

    Drinks.find({}).forEach(function (item) {

        Drinks.update(query(item), update(item), filter);

    });

    Products.find({}).forEach(function (item) {

        Products.update(query(item), update(item), filter);

    });

    Medias.find({}).forEach(function (item) {

        Medias.update(query(item), update(item), filter);

    });

    Others.find({}).forEach(function (item) {

        Others.update(query(item), update(item), filter);

    });

};
