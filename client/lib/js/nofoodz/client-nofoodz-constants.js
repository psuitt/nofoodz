Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.consts = function () {

    var _urls = {
        FOOD: '/#/pages/food/',
        DRINK: '/#/pages/drink/',
        PRODUCT: '/#/pages/product/',
        BRAND: '/#/pages/brand/',
        PEOPLE: '/#/users/people/',
        ADD: '/#/pages/add/'
    };

    return {

        urls: _urls,
        PAGE_LIMIT: 2,
        FOOD: 'food',
        DRINK: 'drink',
        PRODUCT: 'product'

    }

}();

Client.NoFoodz.consts.flags = {
    REPORTED: 'R',
    ADMIN_SUPER: 'S'
};