Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.lib = function () {

	var MAX_PAGE_AMOUNT = 15;

	return {
		
		formatDate: function(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
		},
		
		formatDateTime: function(date) {

			var time = [],
					hours = date.getHours() + 1;
			
			time.push((date.getMonth() + 1));
			time.push('/');
			time.push(date.getDate());
			time.push('/');
			time.push(date.getFullYear());
			time.push(' ');
			time.push((hours % 12));
			time.push(':');
			time.push((date.getMinutes() + 1));
						
			if (hours > 11 && hours !== 24) {
				time.push(' PM');
			} else {
				time.push(' AM');			
			}
			
			return time.join('');
		},

		getParameters: function (str) {
			return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
				return n = n.split("="), this[n[0]] = n[1], this
			}.bind({}))[0];
		}
		
	};

}();

Client.NoFoodz.lib.key = function () {

	return {
		getCode: function(e) {
			return e.keyCode || e.which;
		}
	};

}();
