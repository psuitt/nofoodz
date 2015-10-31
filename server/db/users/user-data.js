Meteor.methods({

    userData: function () {

        console.log('Fetching simple user data. [UserId=' + this.userId + ']');

        if (!this.userId)
            throw new Meteor.Error(403, 'You must be logged in');

        var query = {
            _id: this.userId
        };

        var filter = {
            fields: {
                admin: 1,
                username: 1,
                profile: 1
            }
        };

        return Meteor.users.findOne(query, filter);

    },

    userDataSimple: function () {

        console.log('Fetching simple user data. [UserId=' + this.userId + ']');

        if (!this.userId)
            throw new Meteor.Error(403, 'You must be logged in');

        var query = {
            _id: this.userId
        };

        var filter = {
            fields: {
                admin: 1,
                username: 1,
                'profile.links': 1
            }
        };

        return Meteor.users.findOne(query, filter);

    }

});