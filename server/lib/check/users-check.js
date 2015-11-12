/**
 * Created by Sora on 11/11/2015.
 */
var USER_REGEX = /^[0-9a-z][0-9a-z_]+[0-9a-z]$/i;

UsernameCharacters = Match.Where(function (x) {
    check(x, String);
    return x.trim().length !== 0 && USER_REGEX.test(x);
});
