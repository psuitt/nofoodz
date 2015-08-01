/**
 * Created by Sora on 7/30/2015.
 */
Template.register.events({

    'click #register_cancel': function (e, t) {

        e.preventDefault();

        $('#register_form').toggle(false);
        $('#login_form').toggle(true);

        return false;
    },

    'submit #register_form': function (e, t) {
        e.preventDefault();
        var username = t.find('#account_username').value,
            email = t.find('#account_email').value,
            password = t.find('#account_password').value;

        // Trim and validate the input

        Accounts.createUser({username: username, email: email, password : password}, function(err){
            if (err) {
                // Inform the user that account creation failed
                alert(err);
            } else {
                // Success. Account has been created and the user
                // has logged in successfully.
                alert("Success!");
            }

        });

        return false;
    }
});