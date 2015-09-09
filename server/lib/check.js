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

RatingCheck = Match.Where(function (x) {
    check(x, Number);
    return x === 0 || x === 1 || x === 2 || x === 3 || x === 4 || x === 5 || x === 6;
});

FoodTypeCheck = Match.Where(function (x) {
    check(x, String);
    return x === NoFoodz.consts.db.FOOD || x === NoFoodz.consts.db.DRINK;
});

FoodSubTypeCheck = Match.Where(function (x) {
    check(x, String);
    return x === "alcohol" || x === "default";
});

PageNumber = Match.Where(function (x) {
    check(x, Number);
    return x < 101 && x > 0;
});

ProductsArrayCheck = Match.Where(function (products) {
    check(products, Array);
    _.each(products, function (product) {
        console.log(product);
        check(product, ProductsCheck);
    });
    return products.length >= 0;
});

ProductsCheck = Match.Where(function (product) {
    check(product, Object);
    check(product, {
        brand: NonEmptyStringNoSpecialCharacters,
        type: TypeCheck,
        items: ItemsArrayCheck
    });
    return true;
});

ItemsArrayCheck = Match.Where(function (items) {
    check(items, Array);
    _.each(items, function (item) {
        check(item, ItemsCheck);
    });
    return items.length >= 0;
});

ItemsCheck = Match.Where(function (item) {
    check(item, Object);
    check(item.name, NonEmptyStringNoSpecialCharacters);
    check(item.tags, Array);
    check(item.rating, Match.Optional(Number));
    if (item.rating) {
        check(item.rating, RatingCheck);
    }

    return true;
});

TypeCheck = Match.Where(function (x) {
    check(x, String);
    var type = x.toLowerCase();
    return type === NoFoodz.consts.db.FOOD || type === NoFoodz.consts.db.DRINK || type === NoFoodz.consts.db.BRAND || type === NoFoodz.consts.db.PRODUCT;
});

NullCheck = Match.Where(function (x) {
    check(x, Object);
    return x;
});

InfoCheck = Match.Where(function (x) {
    check(x, Object);
    return x;
});

InfoCheckMap = {
    subtype: FoodSubTypeCheck
};