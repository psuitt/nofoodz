/**
 * Created by Sora on 11/11/2015.
 */
var ITEM_NAME_REGEX = /^[0-9a-z][0-9a-z\-'&\s()+\.]+$/i;

ItemNameCheck = Match.Where(function (x) {
    check(x, String);
    return x.trim().length !== 0 && ITEM_NAME_REGEX.test(x);
});

ProductsArrayCheck = Match.Where(function (products) {
    check(products, Array);
    _.each(products, function (product) {
        check(product, ProductsCheck);
    });
    return products.length >= 0;
});

ProductsCheck = Match.Where(function (product) {
    check(product, Object);
    check(product, {
        brand: ItemNameCheck,
        brand_id: Match.Optional(NonEmptyStringNoSpaceCharacters),
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
    check(item.name, ItemNameCheck);
    check(item.tags, TagsArrayCheck);
    check(item.rating, Match.Optional(Number));
    if (item.rating) {
        check(item.rating, RatingCheck);
    }

    return true;
});

TagsArrayCheck = Match.Where(function (items) {
    check(items, Array);
    _.each(items, function (item) {
        check(item, LowerCaseCheck);
    });
    return items.length >= 0;
});

LowerCaseCheck = Match.Where(function (s) {
    return s.toLowerCase() === s;
});

RatingCheck = Match.Where(function (x) {
    check(x, Number);
    return x === 0 || x === 1 || x === 2 || x === 3 || x === 4 || x === 5 || x === 6;
});

TypeCheck = Match.Where(function (x) {
    check(x, String);
    var type = x.toLowerCase();
    return type === NoFoodz.consts.db.FOOD
        || type === NoFoodz.consts.db.DRINK
        || type === NoFoodz.consts.db.PRODUCT
        || type === NoFoodz.consts.db.MEDIA
        || type === NoFoodz.consts.db.OTHER
        || type === NoFoodz.consts.db.BRAND;
});
