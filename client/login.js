Template.login.events({

    'submit #login-form': function (e, t) {
        e.preventDefault();
        // retrieve the input field values
        var email = t.find('#login-email').value,
            password = t.find('#login-password').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function (err) {
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