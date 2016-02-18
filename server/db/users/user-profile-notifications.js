Meteor.methods({

    readNotifications: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            _id: this.userId
        };

        var update = {
            $set: {
                'profile.isnotification': false
            }
        };

        Meteor.users.update(query, update);

    }

});