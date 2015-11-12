Meteor.methods({

    userData: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            _id: this.userId
        };

        var filter = {
            fields: {
                roles: 1,
                username: 1,
                profile: 1
            }
        };

        return Meteor.users.findOne(query, filter);

    },

    userDataSimple: function () {

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var query = {
            _id: this.userId
        };

        var filter = {
            fields: {
                roles: 1,
                username: 1
            }
        };

        return Meteor.users.findOne(query, filter);

    }

});