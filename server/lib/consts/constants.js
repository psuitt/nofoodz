NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

PAGE_LIMIT = 15;

NoFoodz.consts = {};

NoFoodz.consts.urls = {
    FOOD: '/#/pages/food/',
    DRINK: '/#/pages/drink/',
    PRODUCT: '/#/pages/product/',
    MEDIA: '/#/pages/media/',
    OTHER: '/#/pages/other/',
    BRAND: '/#/pages/brand/',
    PEOPLE: '/#/users/people/'
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
    // Admin Can do everything
    SUPER: 'S',
    // Can only add single items
    NORMAL: 'N',
    // Can add multiple items
    MOD: 'M'
};

NoFoodz.consts.db = {
    FOOD: 'food',
    DRINK: 'drink',
    PRODUCT: 'product',
    MEDIA: 'media',
    OTHER: 'other',
    BRAND: 'brand'
};