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
        })

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);
        if (NoFoodz.utils.user.isMod(Meteor.user()))
            throw new Meteor.Error(403, NoFoodz.messages.errors.MOD_TYPE);

        var notificationObj = {
            user_id: notification.user_id,
            rating: notification.rating,
        };

        notificationObj[notification.type.toLowerCase() + '_id'] = notification._id;

        var noti = NoFoodz.notifications.create(NoFoodz.notifications.types.RATING, notificationObj);
        NoFoodz.notifications.notify(user_id, noti);

    }

});
