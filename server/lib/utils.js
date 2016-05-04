NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.utils = {

	StripCharacters: function(s) {
		return s.replace(/[^\w\s]/gi, '');
	},

	Tokenize: function(s) {
		var l = s.toLowerCase();
		
		l = l.replace(/[^\w\s]/gi, '');	
		
		var sp = l.split(" ");
		var uniqueArray = [];
		for (var i = 0, len = sp.length; i < len; i += 1) {
			if (uniqueArray.indexOf(sp[i]) === -1)
				uniqueArray.push(sp[i]);
		}
		return uniqueArray;
	},

	calculateRating: function (item) {
		var calc = item.ratingtotal_calc > 0 && item.ratingcount_calc > 0 ? item.ratingtotal_calc / parseFloat(item.ratingcount_calc) : 0;
		return Number(calc);
	}

};

NoFoodz.utils.user = {

	isAdmin: function (user) {
		return user.roles && user.roles.indexOf(NoFoodz.consts.admin.SUPER) > -1;
	},

	isMod: function (user) {
		return user.roles && user.roles.indexOf(NoFoodz.consts.admin.MOD) > -1;
	},

	isNormalUser: function (user) {
		return user.roles && user.roles.indexOf(NoFoodz.consts.admin.NORMAL) > -1;
	}

};