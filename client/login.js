var submit = function (e) {
    // retrieve the input field values
    var email = $('#login_email').val().toLocaleLowerCase(),
        password = $('#login_password').val();

    // Trim and validate your fields here....

    // If validation passes, supply the appropriate fields to the
    // Meteor.loginWithPassword() function.
    Meteor.loginWithPassword(email, password, function (err) {
        if (err) {
            // Inform the user that account creation failed
            $('.error-message').text('Invalid login');
        } else {
            $('#login_close').click();
        }
    });
    return false;
};

$(document).on('submit', '#login_form', submit);

$(document).on('keypress', '#login_email, #login_password', function (evt) {
    if (evt.which === 13) {
        $('#login_form').submit();
    }
});

$(document).on('click', 'login_button', function () {
    $('#login_form').submit();
});
