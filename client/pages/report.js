var button;

$(document).on('click', '.button.report', function () {

    $('#report-dialog').modal('show');
    button = $(this);

});

$(document).on('click', '#report_button', function () {

    if (!button) {
        return;
    }

    var options = {};

    options._id = button.attr('item-id');
    options.type = button.attr('item-type').toLowerCase();

    Meteor.call('reportInappropriate', options, function (err, data) {

        if (!err) {

            $('#report-dialog').modal('hide');
            button.html('Reported').addClass('reported');

        }

    });
});
