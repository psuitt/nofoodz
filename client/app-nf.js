/**
 * Created by Sora on 11/23/2015.
 */


$('.searchbar input').nofoodssearch();

// Hide listener
$('body').on('click', function (e) {
    //$('#menu_close').click();
    if ($(e.target).closest('#notificationsList').length === 0
        && $(e.target).closest('#notifications').length === 0
        && $('#notifications').hasClass('open')) {
        $('#notifications').removeClass('open');
        $('#notificationsList').removeClass('open');
    }

    if ($(e.target).closest('.menu-secondary-nav').length === 0
        && $(e.target).closest('.primary-nav').length === 0) {
        closeNav();
    }

});

$(document).on('click', '#notifications', function (event) {

    event.stopPropagation();

    if (!$(this).hasClass('open')) {
        $(this).addClass('open');
        $('#notificationsList').html('').addClass('open');
        loadNotifications();
    } else {
        $(this).removeClass('open');
        $('#notificationsList').removeClass('open');
    }

});

$('#menu [data-toggle=\'dropdown\']').dropdown();

var loadNotifications = function () {

    var li = $('<li class=\'title\'></li>');
    li.html("Notifications");
    $('#notificationsList').append(li);

    Meteor.call('getUserNotifications', function (err, data) {

        if (!err) {

            if (data && data.length > 0) {

                _.each(data.reverse(), function (notification, index, list) {
                    if (notification.message) {
                        var li = $('<li></li>'),
                            span = $('<span></span>');

                        li.html(notification.message);
                        span.html(NoFoods.lib.formatDate(notification.date));

                        li.prepend(span);
                        $('#notificationsList').append(li);
                    }
                });

            } else {
                var li = $('<li></li>');
                li.html("No notifications available");
                $('#notificationsList').append(li);
            }

        } else {
            var li = $('<li></li>');
            li.html(err);
            $('#notificationsList').append(li);
        }

    });

};

var addListeners = function () {

    $('.close-nav').on('click', closeAll);

    $('.has-children').children('a').on('click', function (event) {
        event.preventDefault();

        var selected = $(this);

        if (selected.next('ul').hasClass('is-hidden')) {
            //desktop version only
            selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
            selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
        } else {
            selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
        }
        //toggleSearch('close');
    });

    $('.back').on('click', function () {
        $(this).parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
    });

    $('#menu_searchbutton').on('click', function () {
        $('#header_searchdiv').toggleClass('is-visible');
    });

    $('.menu-secondary-nav .menu-link').on('click', function (event) {
        if (this.href.indexOf('#') === -1) {
            closeAll();
            return;
        } else if (isNotMobile() && this.className.indexOf('menu-header') !== -1) {
            event.preventDefault();
            return false;
        }
        return true;

    });

};

var closeNav = function () {
    //$('.cd-nav-trigger').removeClass('nav-is-visible');
    // $('.cd-main-header').removeClass('nav-is-visible');
    //$('.cd-primary-nav').removeClass('nav-is-visible');
    $('.has-children ul').addClass('is-hidden').removeClass('moves-out');
    $('.has-children a').removeClass('selected');
    //$('.moves-out').removeClass('moves-out');
    //$('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
    //    $('body').removeClass('overflow-hidden');
    //});
};

var closeAll = function (event) {

    closeMenu();
    $('#menu-navbar').removeClass('in');
    closeNav();

};

var isNotMobile = function () {
    //check window width (scrollbar included)
    var e = window,
        a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    return (e[a + 'Width'] >= 767);

};

var closeMenu = function () {

    var curWidth = $('#menu_user_menu').outerWidth();
    $('#menu_user_menu').data('width', curWidth).animate({right: -curWidth + 'px'}, 350, function () {
        $(this).toggle(false);
    });

    return false;

};

addListeners();
