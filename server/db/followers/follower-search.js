/**
 * Created by Sora on 11/7/2015.
 */
Meteor.methods({

    isFollowing: function (options) {

        check(options, {
            user_id: NonEmptyStringNoSpaceCharacters
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var userId = this.userId;

        var query = {
            user_id: options.user_id,
            follower_id: userId
        };

        var following = Followers.findOne(query);

        if (following && following._id)
            return true;
        return false;

    },

    getFollowers: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var userId = this.userId;

        var query = {
            user_id: userId
        };

        var filter = {
            fields: {
                follower_id: 1,
                followername: 1
            }
        };

        return Followers.find(query, filter).fetch();

    },

    getFollowing: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var userId = this.userId;

        var query = {
            follower_id: userId
        };

        var filter = {
            fields: {
                user_id: 1,
                username: 1
            }
        };

        return Followers.find(query, filter).fetch();
    }

});