/**
 * Created by Sora on 9/10/2015.
 */
Meteor.methods({

    createNotification: function (notification) {

        console.log(notification);

        check(notification, {
            user_id: NonEmptyStringNoSpaceCharacters,
            rating: RatingCheck,
            type: TypeCheck,
            _id: NonEmptyStringNoSpaceCharacters
        })

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var notificationObj = {
            user_id: notification.user_id,
            rating: notification.rating,
        };

        notificationObj[notification.type.toLowerCase() + '_id'] = notification._id;

        var noti = NoFoodz.notifications.create(NoFoodz.notifications.types.RATING, notificationObj);
        NoFoodz.notifications.notify(this.userId, noti);

    }

});
