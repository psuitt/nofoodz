Ratings = new Meteor.Collection("ratings");
Foods = new Meteor.Collection("foods");
Drinks = new Meteor.Collection("drinks");
Brands = new Meteor.Collection("brands");

UpdateFood = function (options, callback) {
    var response = {};
    Meteor.call('updateFood', options, function (err, data) {
        response.error = err;
        response.data = data;
        callback && callback(response);
    });
};

UpdateDrink = function (options, callback) {
    var response = {};
    Meteor.call('updateDrink', options, function (err, data) {
        response.error = err;
        response.data = data;
        callback && callback(response);
    });
};

UpdateProduct = function (options, callback) {
    var response = {};
    Meteor.call('updateProduct', options, function (err, data) {
        response.error = err;
        response.data = data;
        callback && callback(response);
    });
};
