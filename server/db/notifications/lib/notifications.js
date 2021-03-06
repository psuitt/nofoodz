NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.notifications = function () {

    var MAX_NOTIFICATIONS = 8;

    var _types = {
        GENERIC: "generic",
        RATING: "rating",
        FOLLOWING: "f"
    };

    var _messageMethods = {};

    _messageMethods[_types.RATING] = function () {

        var item;
        var href;
        var user = Meteor.users.findOne({_id: this.user_id}, {
            fields: {
                username: 1
            }
        });
        var filter = {
            fields: {
                name: 1
            }
        };

        var db = NoFoodz.db.typeToDb(this.type);

        item = db.findOne({_id: this._id}, filter);
        href = NoFoodz.consts.urls[this.type.toUpperCase()];
        href += this._id;

        var message = '';

        message += '<a href=\'';
        message += NoFoodz.consts.urls.PEOPLE;
        message += user.username;
        message += '\'>';
        message += user.username;
        message += '</a>';
        message += ' rated <a href=\'';
        message += href;
        message += '\'>';
        message += item.name;
        message += '</a> ';
        message += this.rating;
        message += ' hearts.';

        return message;

    };

    _messageMethods[_types.FOLLOWING] = function () {

        var message = '';

        message += '<a href=\'';
        message += NoFoodz.consts.urls.PEOPLE;
        message += this.followername;
        message += '\'>';
        message += this.followername;
        message += '</a>';
        message += ' is now following you.';

        return message;

    };

    var _createNotification = function (type, options) {

        var message = options.message;

        if (_messageMethods[type]) {
            message = _messageMethods[type].call(options);
        }

        var notification = {
            user_id: options.user_id,
            message: message,
            isread: false,
            date: new Date()
        };

        return notification;

    };

    var _notifyFollowers = function (notification) {

        var query = {
            user_id: notification.user_id
        };

        var filter = {
            fields: {
                follower_id: 1
            }
        };

        _.each(Followers.find(query, filter).fetch(), function (element, index, list) {
            Meteor.users.update({_id: element.follower_id}, {
                $set: {
                    'profile.isnotification': true
                },
                $push: {
                    'profile.notifications': {
                        $each: [notification],
                        $slice: -MAX_NOTIFICATIONS
                    }
                }
            });
        });

    };

    var _notify = function (notification) {

        Meteor.users.update({_id: notification.user_id}, {
            $set: {
                'profile.isnotification': true
            },
            $push: {
                "profile.notifications": {
                    $each: [notification],
                    $slice: -MAX_NOTIFICATIONS
                }
            }
        });


    };

    return {

        types: function () {
            return _.extend({}, _types);
        }(),

        notify: function (notification) {
            return _notify(notification);
        },

        notifyFollowers: function (notification) {
            return _notifyFollowers(notification);
        },

        create: function (type, options) {
            return _createNotification(type, options);
        }

    };

}();