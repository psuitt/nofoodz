/**
 * Created by Sora on 12/2/2015.
 */
NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.format = function () {

    return {

        camelCase: function (s) {
            return (s || '').toLowerCase().replace(/(\b|-)\w/g, function (m) {
                return m.toUpperCase();
            });
        }

    }

}();
