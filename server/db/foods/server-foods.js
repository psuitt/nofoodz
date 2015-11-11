/**
 * Created by Sora on 9/8/2015.
 */
Foods = new Meteor.Collection("foods");

Foods.allow({
    insert: function (userId, food) {
        return false;
    },
    update: function (userId, food) {
        return false;
    },
    remove: function (userId, food) {
        // not possibly yet
        return false;
    }
});

Foods.deny({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

FoodRatings = new Meteor.Collection("food_ratings");

FoodRatings.allow({
    insert: function (userId, food) {
        return false;
    },
    update: function (userId, food) {
        return false;
    },
    remove: function (userId, food) {
        // not possibly yet
        return false;
    }
});

FoodRatings.deny({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});
