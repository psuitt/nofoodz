Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.consts = function () {

    var _urls = {
        FOOD: '/#/pages/food/',
        DRINK: '/#/pages/drink/',
        PRODUCT: '/#/pages/product/',
        MEDIA: '/#/pages/media/',
        OTHER: '/#/pages/other/',
        BRAND: '/#/pages/brand/',
        PEOPLE: '/#/users/people/',
        ADD: '/#/pages/add/'
    };

    var _types = {
        FOOD: 'food',
        DRINK: 'drink',
        PRODUCT: 'product',
        MEDIA: 'media',
        OTHER: 'other',
        BRAND: 'brand',
        PEOPLE: 'people'
    };

    return {

        urls: _urls,
        types: _types,
        PAGE_LIMIT: 2,
        BRAND: _types.BRAND,
        FOOD: 'food',
        DRINK: 'drink',
        PRODUCT: 'product',
        MEDIA: 'media',
        OTHER: 'other'

    };

}();

Client.NoFoodz.consts.flags = {
    REPORTED: 'R',
    ADMIN_SUPER: 'S'
};