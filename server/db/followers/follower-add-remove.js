/**
 * Created by Sora on 11/7/2015.
 */
Meteor.methods({

    follow: function (options) {

        check(options, {
            user_id: NonEmptyStringNoSpaceCharacters,
            username: NonEmptyString
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            user_id: options.user_id,
            follower_id: this.userId
        };

        var follower = {
            $set: {
                user_id: options.user_id,
                follower_id: this.userId,
                username: options.username,
                followername: this.user().username,
                date: Date.now()
            }
        };

        Followers.upsert(query, follower);

    },

    unfollow: function (options) {

        check(options, {
            user_id: NonEmptyStringNoSpaceCharacters
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            user_id: options.user_id,
            follower_id: this.userId
        };

        Followers.remove(query);

    }

});