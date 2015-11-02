Template.people.destroyed = function () {
};		

Template.people.rendered = function() {

	var data = this.data;

	Meteor.call('userDataSimple', function (err, currentUser) {

		if (!err && currentUser) {

			if (!currentUser || data.username === currentUser.username) {
				$('span.wishstar').hide();
			}

		}

		loadUser(data, currentUser);

	});

	$('div.nofoods-pagenav a').click(function(e) {
		e.preventDefault();	
		$(this).tab('show');	
	}); 

};

var loadUser = function (data, currentUser) {

	Meteor.call('findUser', {username: data.username}, function (err, response) {

		if (!err && response) {

			var user = response;

			var displayName = user.profile.name ? user.profile.name : user.username;

			$('.people-name').html(displayName);

			findUserRatings(user);

			$('span.wishstar').on('click', function () {
				Meteor.call('addToLinks', {username: data.username});
				$(".wishstar").toggleClass("x100", true);
			});

			loadUserData(currentUser, user.username);

			NoFoods.widgetlib.floatMenu($('#people_nav'));

		}

	});

};

var loadUserData = function (currentUser, username) {

	if (currentUser && currentUser.profile) {

		if (currentUser.profile.links) {
			for (var i = 0, l = currentUser.profile.links.length; i < l; i += 1) {
				if (currentUser.profile.links[i].username === username) {
					$(".wishstar").toggleClass("x100", true);
					break;
				}
			}
		}

	}

}

var findUserRatings = function(user) {

	getFoodsPage(false, 1, true);
	getDrinksPage(false, 1, true);
	getProductsPage(false, 1, true);

};

var getFoodsPage = function (data, page, count) {

	getGenericPage(getProductsPage, data, page, count, 'FOOD');

};

var getDrinksPage = function (data, page, count) {

	getGenericPage(getProductsPage, data, page, count, 'DRINK');

};

var getProductsPage = function (data, page, count) {

	getGenericPage(getProductsPage, data, page, count, 'PRODUCT');

};

var getGenericPage = function (func, data, page, count, type, search) {

	var obj = {
			'page': page,
			'type': type
		},
		t = type.toLowerCase();

	if (search)
		obj['search'] = search;
	if (count)
		obj.count = true;

	Meteor.call('getUserRatings', obj, function (err, data) {

		if (!err && data.items) {

			var itemDiv = $('#people_ratings' + t);

			itemDiv.html('');

			var len = data.items.length;

			if (len !== 0) {

				_.each(data.ratings, function (rating, index, list) {
					var div = NoFoods.widgetlib.createRatingDiv(rating);
					div.addClass(rating[t + '_id']);
					itemDiv.append(div);
				});

				_.each(data.items, function (item, index, list) {
					$('.' + item._id + ' .name a').attr('href', NoFoodz.consts.urls[type] + item._id).html(item.name);
					$('.' + item._id + ' .brand a').attr('href', NoFoodz.consts.urls.BRAND + item.brand_id).html(item.brand_view);
				});

			} else {
				itemDiv.append('No ratings found');
			}

			if (count) {
				$('#people_' + t + ' .myfoods-paging').nofoodspaging({
					max: data.count / data.maxPageSize,
					select: func
				});
			}

		}

	});

};
