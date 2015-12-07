Meteor.startup(function () {
	
		/*
    var myjson = {};
		myjson = JSON.parse(Assets.getText("data/words.json"));
			  
		if (myjson && myjson.data) {
			for (var i = 0, l = myjson.data.length; i < l ; i+= 1) {
				if (!Words.findOne({word: myjson.data[i].word})) {
					Words.insert({word: myjson.data[i].word}); 
				}
			}
		}
		*/
		
	/*setUpStatistics();*/
	runBatchFixes();
 		
});

var setUpStatistics = function() {

};

var runBatchFixes = function() {

	Meteor.users.find({}).forEach(function (user) {

		FoodRatings.update({user_id: user._id}, {
			$set: {
				username_view: user.profile.name
			}
		});

		DrinkRatings.update({user_id: user._id}, {
			$set: {
				username_view: user.profile.name
			}
		});

		ProductRatings.update({user_id: user._id}, {
			$set: {
				username_view: user.profile.name
			}
		});

	});

};
