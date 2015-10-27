FoodComments = new Meteor.Collection("food_comments");

FoodComments.allow({
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

FoodComments.deny({
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

DrinkComments = new Meteor.Collection("drink_comments");

DrinkComments.allow({
    insert: function (userId, drink) {
        return false;
    },
    update: function (userId, drink) {
        return false;
    },
    remove: function (userId, drink) {
        // not possibly yet
        return false;
    }
});

DrinkComments.deny({
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

ProductComments = new Meteor.Collection("product_comments");

ProductComments.allow({
    insert: function (userId, product) {
        return false;
    },
    update: function (userId, product) {
        return false;
    },
    remove: function (userId, product) {
        // not possibly yet
        return false;
    }
});

ProductComments.deny({
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
