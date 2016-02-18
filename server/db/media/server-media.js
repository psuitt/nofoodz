/**
 * Created by Sora on 12/29/2015.
 */
// Start the collection
Medias = new Meteor.Collection("medias");
/*
 Movies
 Music
 Tv Shows
 Video Games
 */

// Set up permissions for the collection
Medias.allow({
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

Medias.deny({
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

MediaRatings = new Meteor.Collection("media_ratings");

// Set up permissions for the collection
MediaRatings.allow({
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

MediaRatings.deny({
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
