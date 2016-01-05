/**
 * Created by Sora on 7/28/2015.
 */
// Start the collection
Lists = new Meteor.Collection("lists");

// Set up permissions for the collection
Lists.allow({
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

Lists.deny({
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
