/**
 * Created by Sora on 11/5/2015.
 */
var COMMENT_REGEX = /^[a-z]+$/i;

CommentCheck = Match.Where(function (x) {
    check(x, String);
    return x.trim().length !== 0 && COMMENT_REGEX.test(x);
});

CommentsCheck = Match.Where(function (comments) {
    check(comments, Array);

    _.each(comments, function (comment) {
        check(comment, CommentCheck);
    });
    return comments.length > 0 && comments.length < 4;
});