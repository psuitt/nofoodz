Meteor.methods({

    getUserNotifications: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var profile = Meteor.user().profile;

        return profile.notifications;

    }

});