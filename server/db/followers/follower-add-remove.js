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

        var userId = this.userId;
        var user = Meteor.user();
        var username = user.username;

        var query = {
            user_id: options.user_id,
            follower_id: userId
        };

        var follower = {
            $set: {
                user_id: options.user_id,
                follower_id: userId,
                username: options.username,
                followername: username,
                notify: true,
                date: Date.now()
            }
        };

        Followers.upsert(query, follower);

        var notification = {
            user_id: options.user_id,
            followername: username
        };

        Meteor.call('createFollowNotification', notification, function (err, data) {
            if (err) {
                console.log('Notification failed ' + EJSON.stringify(notification) + ' err: ' + err);
            }
        });

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