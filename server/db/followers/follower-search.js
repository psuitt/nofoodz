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

        var query = {
            user_id: options.user_id,
            follower_id: this.userId
        };

        var following = Followers.findOne(query);

        return following && following._id;

    },

    getFollowers: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            user_id: this.userId
        };

        var filter = {
            fields: {
                follower_id: 1,
                followername: 1
            }
        }

        var following = Followers.find(query, filter).fetch();

    },

    getFollowing: function (options) {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            follower_id: this.userId
        };

        var filter = {
            fields: {
                user_id: 1,
                username: 1
            }
        }

        var following = Followers.find(query, filter).fetch();
    }

});