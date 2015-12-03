Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.lib = function () {

    var MAX_PAGE_AMOUNT = 15;

    return {

        formatDate: function (date) {
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        },

        formatDateTime: function (date) {

            var time = [],
                hours = date.getHours() + 1;

            time.push((date.getMonth() + 1));
            time.push('/');
            time.push(date.getDate());
            time.push('/');
            time.push(date.getFullYear());
            time.push(' ');
            time.push((hours % 12));
            time.push(':');
            time.push((date.getMinutes() + 1));

            if (hours > 11 && hours !== 24) {
                time.push(' PM');
            } else {
                time.push(' AM');
            }

            return time.join('');
        },

        getParameters: function (hashBased) {
            var query;
            if (hashBased) {
                var pos = location.href.indexOf("?");
                if (pos == -1) return [];
                query = location.href.substr(pos + 1);
            } else {
                query = location.search.substr(1);
            }
            var result = {};
            query.split("&").forEach(function (part) {
                if (!part) return;
                part = part.replace("+", " ");
                var eq = part.indexOf("=");
                var key = eq > -1 ? part.substr(0, eq) : part;
                var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
                var from = key.indexOf("[");
                if (from == -1) result[decodeURIComponent(key)] = val;
                else {
                    var to = key.indexOf("]");
                    var index = decodeURIComponent(key.substring(from + 1, to));
                    key = decodeURIComponent(key.substring(0, from));
                    if (!result[key]) result[key] = [];
                    if (!index) result[key].push(val);
                    else result[key][index] = val;
                }
            });
            return result;
        }

    };

}();

Client.NoFoodz.lib.key = function () {

    return {
        getCode: function (e) {
            return e.keyCode || e.which;
        }
    };

}();
