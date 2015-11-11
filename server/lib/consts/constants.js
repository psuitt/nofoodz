NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

PAGE_LIMIT = 15;

NoFoodz.consts = {};

NoFoodz.consts.urls = {
    FOOD: '/pages/food/',
    DRINK: '/pages/drink/',
    PRODUCT: '/pages/product/',
    BRAND: '/pages/brand/',
    PEOPLE: '/users/people/'
};

NoFoodz.consts.flags = {
    REPORTED: 'R'
};

NoFoodz.consts.filters = {
    HIDDEN_FOODS: {
        fields: {
            keywords: 0,
            reporters: 0
        }
    }
};

NoFoodz.consts.admin = {
    SUPER: 'S',
    // Roles
    NORMAL: 'N',
    MOD: 'M'
};

NoFoodz.consts.db = {
    FOOD: 'food',
    DRINK: 'drink',
    PRODUCT: 'product',
    BRAND: 'brand'
};