/**
 * Created by Sora on 8/2/2015.
 */
Template.menu.helpers({
    username: function () {
        var user = Meteor.user();
        return user.username.substring(0, 1).toUpperCase() + user.username.substring(1);
    },
    usernameShort: function () {
        var user = Meteor.user();
        return user.username.substring(0, 2).toUpperCase();
    }
});

Template.menu.rendered = function () {
    $('#menu_user_menu [data-toggle=\'dropdown\']').dropdown();
};

Template.menu.events({

    'click #menu_open_button': function (e, t) {

        e.preventDefault();

        $('#menu_user_menu').toggle(true).animate({right: '0'}, 350);

        return false;

    },

    'click #menu_close': function (e, t) {

        e.preventDefault();

        var curWidth = $('#menu_user_menu').outerWidth();
        $('#menu_user_menu').data('width', curWidth).animate({right: -curWidth + 'px'}, 350, function () {
            $(this).toggle(false);
        });

        return false;
    },

    'click #menu_login_button': function (e, t) {

        e.preventDefault();

        Meteor.logout(function (err) {
            // TODO - Do something if there is an error.
        });

        return false;
    }

});