Accounts.config({
    sendVerificationEmail: true,
    loginExpirationInDays: 20
});

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function (user) {

    var settings = Settings.findOne({'_type': 'accounts'});

    if (settings) {
        if (settings.disableUserCreate)
            throw new Meteor.Error(500, "Username creation is currently disabled");
        if (settings.specialPrefix && settings.specialPrefix !== '') {
            if (user.username.indexOf(settings.specialPrefix) === 0) {
                user.username = user.username.replace(settings.specialPrefix, '');
            } else {
                throw new Meteor.Error(500, 'Username creation is currently disabled');
            }
        }
    }

    if (!user.username || user.username.length < 4 || user.username.length > 20) {
        throw new Meteor.Error(403, 'Username must have at least 4-20 alphanumeric characters');
    }

    check(user.username, UsernameCharacters);
    Statistics.upsert(
        {_type: NoFoodz.consts.statistics.USER_COUNT},
        {$inc: {count: 1}}
    );

    return true
});

Accounts.onCreateUser(function (options, user) {
    user.active = true;
    user.roles = [NoFoodz.consts.admin.NORMAL];
    user.profile = {
        name: options.username,
        bonusHearts: 10,
        date: new Date()
    };
    // Lower case only.
    user.username = user.username.toLowerCase();
    return user;
});

// EMAIL CODE

Accounts.emailTemplates.siteName = 'NoFoodz';
Accounts.emailTemplates.from = 'NoFoodz Accounts <noreply@nofoodz.com>';
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return 'Welcome to NoFoodz, ' + user.profile.username;
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
    return 'To activate your account, simply click the link below:\n\n'
        + url;
};