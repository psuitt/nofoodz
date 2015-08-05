NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.consts = function() {

	var _urls = {
		FOOD : '/pages/food/',
		DRINK : '/pages/drink/',
		BRAND : '/pages/brand/',
		PEOPLE : '/users/people/',
		ADD : '/pages/add/'
	};

	return {
	
		urls: _urls,
		PAGE_LIMIT: 2,
		FOOD: "food",
		DRINK: "drink"
	
	}
	
}();

NoFoodz.consts.flags = {
	REPORTED : 'R',
	ADMIN_SUPER : 'S'
};