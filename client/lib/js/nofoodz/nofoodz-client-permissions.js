NoFoodz = typeof NoFoodz === 'undefined' ? {} : NoFoodz;

NoFoodz.client = typeof NoFoodz.client === 'undefined' ? {} : NoFoodz.client;

NoFoodz.client.permissions = function() {

    return {

        isAdmin: function(user) {
            try {
                return user.roles.indexOf('S') > -1;
            } catch (err) {
                return false;
            }
        },

        addAccess: function(user) {
            try {
                return user.roles.indexOf('S') > -1 || user.roles.indexOf('M') > -1 || user.roles.indexOf('N') > -1;
            } catch (err) {
                return false;
            }
        },

        createMultiple: function(user) {
            try {
                return user.roles.indexOf('S') > -1 || user.roles.indexOf('M') > -1;
            } catch (err) {
                return false;
            }
        }

    }

}();