/**
 * Created by Sora on 9/8/2015.
 */
Drinks = new Meteor.Collection("drinks");

Drinks.allow({
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

Drinks.deny({
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

DrinkRatings = new Meteor.Collection("drink_ratings");

DrinkRatings.allow({
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

DrinkRatings.deny({
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