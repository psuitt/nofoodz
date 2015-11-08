/**
 * Created by Sora on 11/6/2015.
 */
Validator = {

    validate: function () {

        var obj = arguments[0];

        for (var i = 1; i < arguments.length; i++) {

            var field = arguments[i];

            if (!obj.hasOwnProperty(field) || !obj[field])
                throw new Meteor.Error(500, 'A required field is missing. [' + field + ']');

        }

    }

};