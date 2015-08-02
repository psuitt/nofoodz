/**
 * Created by Sora on 7/30/2015.
 */
Template.register.events({

    'click #register_close': function (e, t) {

        e.preventDefault();

        $('#register_form').toggle(false);
        $('#login_form').toggle(true);
        $('#login_close').click();

        return false;

    },


    'click #register_cancel': function (e, t) {

        e.preventDefault();

        $('#register_form').toggle(false);
        $('#login_form').toggle(true);

        t.$('.error-message').text('');

        return false;
    },

    'submit #register_form': function (e, t) {
        e.preventDefault();
        var username = t.find('#register_username').value,
            email = t.find('#register_email').value,
            password = t.find('#register_password').value,
            confirmPassword = t.find('#register_confirm_password').value;

        if (password !== confirmPassword) {
            t.$('.error-message').text('Passwords do not match');
        } else {

            // Trim and validate the input
            Accounts.createUser({username: username, email: email, password: password}, function (err) {
                if (err) {
                    // Inform the user that account creation failed
                    t.$('.error-message').text(err.reason);
                } else {
                    t.find('#login_cancel').click();
                }

            });

        }

        return false;
    }
});