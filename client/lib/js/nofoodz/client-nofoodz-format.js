Client = typeof Client === 'undefined' ? {} : Client;

Client.NoFoodz = typeof Client.NoFoodz === 'undefined' ? {} : Client.NoFoodz;

Client.NoFoodz.format = function () {

    return {

        camelCase: function (s) {
            return (s || '').toLowerCase().replace(/(\b|-)\w/g, function (m) {
                return m.toUpperCase();
            });
        },

        calculateAverage: function (item) {
            return item.ratingtotal_calc > 0 ? (item.ratingtotal_calc / parseFloat(item.ratingcount_calc)).toFixed(2) : 0;
        },

        calculateAverageDisplay: function (item) {

            var avg = this.calculateAverage(item);

            if (avg != 0 && avg.lastIndexOf('0') === 3) {
                avg = avg.substring(0, 3);
                avg = avg.replace('.0', '');
            }

            return avg;

        }

    }

}();
