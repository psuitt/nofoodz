var nofoodsRating,
    idField,
    screenData;


Template.foods.events({

    'click #foods_comment': function (event, template) {

        var comments = [];

        $('.foods-comment-input').each(function () {
            var val = $(this).val();
            if (val)
                comments.push(val);
        });

        var obj = {
            item_id: screenData._id,
            type: screenData.type,
            comments: comments
        };

        Meteor.call('updateComments', obj, function (err) {

            if (!err) {
                NoFoodz.alert.msg('success', 'Save was successful!');
                updateComments(comments);
            } else {
                NoFoodz.alert.msg('danger', 'Save was unsuccessful!');
            }

        });

    },

    'click #foods_editcomments': function (event, template) {

        $('#foods_commentsdiv').toggleClass('comment-mode').toggleClass('display-mode');

    }
});

Template.foods.destroyed = function () {
};

Template.foods.rendered = function () {

    screenData = this.data;

    var obj = {
        _id: screenData._id,
        type: screenData.type
    };

    if (screenData.type === NoFoodz.consts.FOOD) {
        idField = 'food_id';
    } else if (screenData.type === NoFoodz.consts.DRINK) {
        idField = 'drink_id';
    } else {
        idField = 'product_id';
    }

    Meteor.call('getItemById', obj, done);
    Meteor.call('findCommentsForItem', {
        item_id: screenData._id,
        type: screenData.type
    }, loadComments);

    nofoodsRating = $('div.ratingDiv').nofoodsrating({
        hearts: 6,
        select: function (rating) {

            var options = {
                rating: rating,
                _id: screenData._id,
                type: screenData.type
            };

            Meteor.call('updateRating', options, function (err, data) {

                if (!err) {
                    reloadRating(data);
                    $('#foods_commentsdiv').removeClass('no-user-rating');
                }

            });

        }
    });

    NoFoods.widgetlib.floatMenu($('#foods-nav'));

    $('span.wishstar').on('click', function () {
        var options = {};

        options[idField] = screenData._id;

        Meteor.call('addToWishList', options);

        $('.wishstar').toggleClass('x100', true);
    });

    $('.food-menu-link').on('click', function (e) {
        var self = $(this);
        e.preventDefault();
        $('#foods-nav li').removeClass('active');
        self.parent().addClass('active');
        var height = $(self.attr('link')).offset().top - $('#menu').height(),
            currentHeight = $('body').scrollTop(),
            max = $(document).height() - $(window).height();

        if ((currentHeight !== max && height > currentHeight)
            || (height < currentHeight)) {
            $('body').animate({
                scrollTop: height
            }, 300);
        }

        return false;
    });

};

var done = function (err, data) {

    if (err || !data || !data.item) {
        Router.go('/404');
    }

    var item = data.item;

    var avg = reloadRating(item);

    $('.food-name').html(item.name);
    $('.brand').html(NoFoods.widgetlib.createBrandLink(item.brand_id, item.brand_view));

    if (item.flags && item.flags.indexOf(NoFoodz.consts.flags.REPORTED) !== -1)
        $('.button.report').addClass('reported')
            .html('Reported')
            .attr('title', 'This item has been reported.');

    if (data.userRating) {
        nofoodsRating.setUserValue(data.userRating.rating);
        var comments = data.userRating.comments;
        updateComments(comments);
        $('#foods_commentsdiv').removeClass('no-user-rating');
    } else {
        nofoodsRating.setValue(avg);
    }

    loadUserData(item._id);

    // Create the additional info div with the items data
    /*
     $('#infoDiv').nofoodzadditionalinfo({
     _id: item._id,
     type: PARAMS.type,
     info: item.info,
     update: item.user_id === Meteor.user()._id
     });*/

};

var updateComments = function (comments) {

    if (comments && comments.length > 0) {

        $('#foods_commentsdiv').removeClass('comment-mode no-comments').addClass('display-mode');

        var inputs = $('.foods-comment-input');
        var spans = $('.foods-comment');

        inputs.eq(0).val(comments[0]).attr('default', comments[0]);
        inputs.eq(1).val(comments[1]).attr('default', comments[1]);
        inputs.eq(2).val(comments[2]).attr('default', comments[2]);

        spans.eq(0).text(comments[0]).attr('default', comments[0]);
        spans.eq(1).text(comments[1]).attr('default', comments[1]);
        spans.eq(2).text(comments[2]).attr('default', comments[2]);

    }

};

var loadUserData = function (id) {

    var user = Meteor.user();

    if (user.profile) {

        if (user.profile.wishlist) {
            for (var i = 0, l = user.profile.wishlist.length; i < l; i += 1) {
                if (user.profile.wishlist[i][idField] === id) {
                    $('.wishstar').toggleClass('x100', true);
                    break;
                }
            }
        }

    }

};

var reloadRating = function (item) {

    var avg = item.ratingtotal_calc > 0 ? (item.ratingtotal_calc / parseFloat(item.ratingcount_calc)).toFixed(2) : 0;

    if (avg != 0 && avg.lastIndexOf('0') === 3) {
        avg = avg.substring(0, 3);
        avg = avg.replace('.0', '');
    }

    $('.totalRating').html(avg);
    $('.totalCount').html(item.ratingcount_calc);

    return avg;

};

var loadComments = function (err, response) {

    $('#foods_comments').jQCloud([{text: 'Empty Comments', weight: 1}], {
        height: 300
    });

    if (!err && response.length > 0) {

        var words = [];

        _.each(response, function (comment, index) {

            words.push({
                text: comment.comment,
                weight: comment.value
            });

        });

        $('#foods_comments').jQCloud('update', words);

    }

}