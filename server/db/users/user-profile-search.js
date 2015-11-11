/**
 * Created by Sora on 9/13/2015.
 */
Meteor.methods({

    findUser: function (options) {

        check(options, {
            username: NonEmptyStringNoSpaceCharacters
        });

        var query = {
            username: options.username
        };

        var filter = {
            fields: {
                username: 1,
                'profile.name': 1
            }
        };

        return Meteor.users.findOne(query, filter);

    },

    findUsers: function (options) {

        check(options, {
            username: NonEmptyStringNoSpaceCharacters
        });

        var response = {
            data: []
        };

        var query = {
            username: {
                $regex: ".*" + options.username + ".*",
                $options: 'i'
            }
        };

        var filter = {
            fields: {
                username: 1
            },
            sort: {
                username: 1
            },
            limit: 20
        };

        var cursor = Meteor.users.find(query, filter);

        response.data = cursor.fetch();

        return response;

    }

});