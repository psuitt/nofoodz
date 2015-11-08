/**
 * Created by Sora on 11/7/2015.
 */
Followers = new Meteor.Collection("followers");

Followers.allow({
    insert: function (userId, follower) {
        return false;
    },
    update: function (userId, follower) {
        return false;
    },
    remove: function (userId, follower) {
        // not possibly yet
        return false;
    }
});

Followers.deny({
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
