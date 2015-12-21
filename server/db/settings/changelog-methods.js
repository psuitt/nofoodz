/**
 * Created by Sora on 12/15/2015.
 */
Meteor.methods({

    getChangeLog: function () {

        return Settings.findOne({'_type': 'changelog'});

    }

});