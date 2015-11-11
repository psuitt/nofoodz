// Deny all user updates.
// Set up permissions for the collection
Meteor.users.allow({
    insert: function () {
        return false;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});

Meteor.users.deny({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

//Search user names
Meteor.publish("userdata", function () {
    if (this.userId) {

        var query = {
            _id: this.userId
        };
        var filter = {
            fields: {
                admin: 1,
                username: 1
            }
        };
        return Meteor.users.find(query, filter);
    } else {
        this.ready();
    }
});