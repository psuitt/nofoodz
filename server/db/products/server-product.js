/**
 * Created by Sora on 7/28/2015.
 */
// Start the collection
Products = new Meteor.Collection("products");

// Set up permissions for the collection
Products.allow({
    insert: function () {
        return false;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});
