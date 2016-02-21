/**
 * Created by Sora on 10/30/2015.
 */
Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.alert = function () {
    return {

        msg: function (type, message) {
            // Success, info, warning, danger
            $('div.alertmessage')
                .removeClass('alert-success alert-info alert-warning alert-danger')
                .addClass('alert-' + type)
                .text(message)
                .show()
                .delay(3000)
                .fadeOut(1000);

        },

        success: function (message) {
            this.msg('success', message);
        }

    };

}();