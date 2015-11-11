Template.wsie.destroyed = function() {

};

Template.wsie.rendered = function() {

    setPath();

};

Template.wsie.events({

    'click #wsie_random': function (event, template) {

        Meteor.call('getRandom', {type: NoFoodz.consts.FOOD}, function (err, response) {

            if (!err) {
                if (response.rating) {
                    $('#wsie_resultbrand').text(response.item.brand_view);
                    $('#wsie_result').text(response.item.name);
                } else {
                    $('#wsie_result').text('Please rate more things to use this feature');
                }
            }

        });

    }

});