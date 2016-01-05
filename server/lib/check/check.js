var LETTER_NUMBER_REGEX = /^[0-9a-z\s]+$/i;
var LETTER_NUMBER_NO_SPACE_REGEX = /^[0-9a-z]+$/i;

NoFoodzString = Match.Where(function (x) {
    check(x, String);
    return x.trim().length !== 0 && x.length < 400;
});

NonEmptyStringNoSpaceCharacters = Match.Where(function (x) {
    check(x, String);
    return x.trim().length !== 0 && LETTER_NUMBER_NO_SPACE_REGEX.test(x);
});

NonEmptyStringNoSpecialCharacters = Match.Where(function (x) {
    check(x, String);
    return x.trim().length !== 0 && LETTER_NUMBER_REGEX.test(x);
});

NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

FoodTypeCheck = Match.Where(function (x) {
    check(x, String);
    return x === NoFoodz.consts.db.FOOD || x === NoFoodz.consts.db.DRINK;
});

PageNumber = Match.Where(function (x) {
    check(x, Number);
    return x < 101 && x > 0;
});

NullCheck = Match.Where(function (x) {
    check(x, Object);
    return x;
});

InfoCheck = Match.Where(function (x) {
    check(x, Object);
    return x;
});
