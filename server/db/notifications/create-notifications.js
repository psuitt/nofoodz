/**
 * Created by Sora on 9/10/2015.
 */
Meteor.methods({

    createNotification: function (notification) {

        check(notification, {
            user_id: NonEmptyStringNoSpaceCharacters,
            rating: RatingCheck,
            type: TypeCheck,
            _id: NonEmptyStringNoSpaceCharacters
        });

        var noti = NoFoodz.notifications.create(NoFoodz.notifications.types.RATING, notification);
        NoFoodz.notifications.notifyFollowers(noti);

    },

    createFollowNotification: function (notification) {

        check(notification, {
            user_id: NonEmptyStringNoSpaceCharacters,
            followername: UsernameCharacters
        });

        var noti = NoFoodz.notifications.create(NoFoodz.notifications.types.FOLLOWING, notification);
        NoFoodz.notifications.notify(noti);

    }

});
