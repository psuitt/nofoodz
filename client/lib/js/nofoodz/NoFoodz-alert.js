/**
 * Created by Sora on 10/30/2015.
 */
NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.alert = function () {
    return {

        msg: function (type, message) {
            // Success, info, warning, danger
            $('div.alertmessage').removeClass('alert-success alert-info alert-warning alert-danger').addClass('alert-' + type);
            $('div.alertmessage').html(message);
            $('div.alertmessage').show().delay(3000).fadeOut(1000)

        }
    };

}();