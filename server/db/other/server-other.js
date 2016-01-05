/**
 * Created by Sora on 12/29/2015.
 */
// Start the collection
Others = new Meteor.Collection("others");
/*
 Websites
 */

// Set up permissions for the collection
Others.allow({
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

Others.deny({
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

OtherRatings = new Meteor.Collection("other_ratings");

// Set up permissions for the collection
OtherRatings.allow({
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

OtherRatings.deny({
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
