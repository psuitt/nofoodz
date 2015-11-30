var reportCheck = Match.Where(function (x) {
    check(x, String);
    return x === "drink" || x === "food" || x === "brand";
});

Meteor.methods({

    reportInappropriate: function (options) {

        check(options, {
            _id: NonEmptyStringNoSpaceCharacters,
            type: reportCheck
        });

        if (!this.userId)
            throw new Meteor.Error(403, NoFoodz.messages.errors.LOGGED_IN);

        var response = {};

        var query = {
            _id: options._id
        };

        var db = NoFoodz.db.typeToDb(options.type);

        db.update(options._id,
            {
                $addToSet: {
                    flags: NoFoodz.consts.flags.REPORTED,
                    reporters: this.userId
                }
            }
        );

    }

});
