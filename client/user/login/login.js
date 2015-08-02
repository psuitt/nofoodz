Template.login.events({

    'click #menu_login_button': function (e, t) {

        e.preventDefault();

        $('#login_form').toggle(true).animate({right: '0'}, 350);

        return false;
    },

    'click #login_close': function (e, t) {

        e.preventDefault();

        var curWidth = $('#login_form').outerWidth();
        $('#login_form').data('width', curWidth).animate({right: -curWidth + 'px'}, 350, function () {
            $(this).toggle(false);
        });

        $('#register_form').toggle(false);
        $('#login_form').toggle(true);

        return false;
    },

    'click #login_create_new_user': function (e, t) {

        e.preventDefault();

        $('#login_form').toggle(false);
        $('#register_form').toggle(true);

        t.$('.error-message').text('');

        return false;
    },

    'submit #login_form': function (e, t) {
        e.preventDefault();
        // retrieve the input field values
        var email = t.find('#login_email').value.toLocaleLowerCase(),
            password = t.find('#login_password').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function (err) {
            if (err) {
                // Inform the user that account creation failed
                t.$('.error-message').text('Invalid login');
            } else {
                t.find('#login_close').click();
            }
        });
        return false;
    }

});