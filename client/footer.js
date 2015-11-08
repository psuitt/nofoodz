Template.footer.rendered = function() {

	Meteor.call('getUserCount', function (err, response) {

		if (!err)
			$('#footer .totalusers').html("Total Users " + response);
		
	});	
	
};