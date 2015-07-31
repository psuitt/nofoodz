/**
 * Created by Sora on 7/30/2015.
 */
Template.register.events({
    'submit #register-form' : function(e, t) {
        e.preventDefault();
        var username = t.find('#account-username').value,
            email = t.find('#account-email').value,
            password = t.find('#account-password').value;

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