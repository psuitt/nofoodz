/*
 Search custom for no foods built on top of jquery.

 */
(function ($) {
    $.fn.nofoodssearch = function (o) {

        var options = {
            values: ['Food', 'Drink', 'Product', 'Brand', 'People'],
            defaultValue: 'Food',
            searchPlaceholder: 'Search',
            select: false,
            router: ''
        };

        if (o)
            options = $.extend(options, o);

        var self = this,
            _searchType = $('<div></div>')
                .addClass('nofoodssearch type btn-group')
                .insertBefore(this),
            _goButton = $('<button></button>')
                .addClass('nofoodssearch go btn btn-default glyphicon glyphicon-search')
                .insertAfter(this);

        var _searchTypeMainDisplay = $('<a data-toggle=\'dropdown\'></a>')
                .addClass('btn dropdown-toggle btn-default'),
            _searchTypeMainDisplayText = $('<span></span>')
                .addClass('nofoodssearch text'),
            _searchTypeMainDisplayCaret = $('<span></span>')
                .addClass('nofoodssearch caret'),
            _searchTypeDropdown = $('<ul></ul>')
                .addClass('dropdown-menu');

        _searchTypeMainDisplay.append(_searchTypeMainDisplayText);
        _searchTypeMainDisplay.append(_searchTypeMainDisplayCaret);

        _searchType.append(_searchTypeMainDisplay);
        _searchType.append(_searchTypeDropdown);

        _searchTypeMainDisplayText.html(options.defaultValue);

        // Add the options now.
        for (var i = 0, length = options.values.length; i < length; i += 1) {
            var li = $('<li></li>'),
                a = $('<a></a>');

            a.html(options.values[i]);
            li.append(a);
            _searchTypeDropdown.append(li);

        }

        self.attr('placeholder', options.searchPlaceholder);
        self.addClass('form-control inline nofoodssearch');

        self.keyup(function (event) {

            var code = event.keyCode || event.which;

            switch (code) {
                case 13:
                    go();
                    break;
                default:
                    break;
            }

        });

        var go = options.select ? options.select : function () {
            var val = self.val().trim(),
                type = _searchTypeMainDisplayText.html().toLowerCase();
            if (val.length > 0) {
                options.router.navigate(['/Find', {type: type, search: val}]);
            }
        };

        _goButton.on('click', function () {
            go();
        });

        _searchTypeDropdown.on('click', 'a', function (e) {
            _searchTypeMainDisplayText.html(e.target.innerHTML)
        });

        _searchTypeMainDisplay.dropdown();

        this.getType = function () {
            return _searchTypeMainDisplayText.text();
        };

        this.getSearch = function () {
            return self.text();
        };

        this.go = function () {
            go();
        };

        return this;

    };

}(jQuery));



