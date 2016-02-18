Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.widgetlib = function () {

    var _floatMenu = function (div) {

        div.jScroll();
        div.on('click', 'li>a', function () {

            var currentTop = $(window).scrollTop(),
                newTop = $("#mainContent").offset().top - 45;

            if (currentTop > newTop)
                $('html, body').animate({scrollTop: newTop}, 200);

        });

    };

    var _staticOffCanvasMenu = function (div) {

        var $window = $(window),
            top = div.offset().top - 52;

        $window.scroll(function () {
            var windowTop = $window.scrollTop(),
                menuTop = $('#menu').offset().top;
            if (windowTop > top) {
                var newTop = (menuTop - top) + 'px';
                div.css('top', newTop);
            } else {
                div.css('top', 0);
            }
        });

        div.on('click', 'li>a', function () {

            var currentTop = $(window).scrollTop(),
                newTop = $("#mainContent").offset().top - 45;

            if (currentTop > newTop)
                $('html, body').animate({scrollTop: newTop}, 200);

        });

    };

    return {

        floatMenu: function (div) {
            _floatMenu(div);
        },

        staticOffCanvasMenu: function (div) {
            _staticOffCanvasMenu(div);
        },

        createDisplay: function (ratingOrItem, type, addBrand, number) {

            var div = $('<div class=\'myrating myfoods\'></div>'),
                name = $('<span class=\'name myfoods item-color\'></span>'),
                nameLink = $('<a></a>');
            var ratingSpan = $('<span class=\'rating\' data-toggle=\'tooltip\' data-placement=\'top\'></span>'),
                ratingVal = 0,
                addCount = false;

            if (ratingOrItem.hasOwnProperty('ratingcount_calc')) {
                ratingVal = parseFloat(Client.NoFoodz.format.calculateAverageDisplay(ratingOrItem));
                nameLink.attr('href', Client.NoFoodz.consts.urls[type.toUpperCase()] + ratingOrItem._id);
                nameLink.text(ratingOrItem.name);
                addCount = true;

                div.attr(type.toLowerCase(), ratingOrItem._id);
            } else {
                ratingVal = ratingOrItem.rating;
                nameLink.attr('href', Client.NoFoodz.consts.urls[type.toUpperCase()] + ratingOrItem.item_id);
                nameLink.text(ratingOrItem.name_view);

                div.attr(type.toLowerCase(), ratingOrItem.item_id);
            }

            if (addBrand && ratingOrItem.brand_id) {
                var brand = $('<span class=\'brand myfoods brand-color\'></span>'),
                    brandLink = $('<a></a>');

                brandLink.attr('href', Client.NoFoodz.consts.urls.BRAND + ratingOrItem.brand_id);
                brandLink.text(ratingOrItem.brand_view);

                brand.append(brandLink);
                div.append(brand);
            }

            name.append(nameLink);

            // Add the name to the div
            div.prepend(name);

            if (addCount) {

                var count = ratingOrItem.ratingcount_calc;

                if (!count) {
                    count = 0;
                }

                var totalSpan = $('<span class=\'totalRating\' title=\'Number of Ratings\'></span>');
                totalSpan.text('(' + count + ')');
                div.prepend(totalSpan);

                totalSpan.tooltip({container: '#tooltip'});

            }

            var i = (Math.round((ratingVal * 2)) * 10).toString();

            ratingSpan.addClass('x' + i);

            if (ratingVal) {
                ratingSpan.attr('title', ratingVal);
            } else {
                ratingSpan.attr('title', 'No Ratings');
            }

            // Add the rating to the div
            div.prepend(ratingSpan);

            if (number) {
                var numberSpan = $('<span class=\'number\'></span>');
                numberSpan.text(number + '.');
                // Add the rating to the div
                div.prepend(numberSpan);
            }

            ratingSpan.tooltip({container: '#tooltip'});

            return div;

        },

        createEmptySelect: function () {

            var searchType = $("<div></div>")
                .addClass("type btn-group nofoodz-combo"),
                searchTypeMainDisplay = $("<a data-toggle='dropdown'></a>")
                    .addClass("btn dropdown-toggle btn-default"),
                searchTypeMainDisplayText = $("<span></span>")
                    .addClass("text"),
                searchTypeMainDisplayCaret = $("<span></span>")
                    .addClass("caret"),
                searchTypeDropdown = $("<ul></ul>")
                    .addClass("dropdown-menu");

            searchTypeMainDisplay.append(searchTypeMainDisplayText);
            searchTypeMainDisplay.append(searchTypeMainDisplayCaret);

            searchType.append(searchTypeMainDisplay);
            searchType.append(searchTypeDropdown);

            return searchType;

        },

        createBrandLink: function (id, name) {
            return $('<a class=\'brand\'></a>').attr('href', Client.NoFoodz.consts.urls.BRAND + id).html(name);
        }

    };

}();
