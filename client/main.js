Router.configure({
    layoutTemplate: 'mainLayout'
});

Router.map(function () {

    this.route('error404', {
        path: '/404',
        template: 'error404',
        layoutTemplate: 'mainLayout'
    });

    this.route('home', {
        path: '/',
        template: 'home',
        layoutTemplate: 'mainLayout'
    });

    this.route('admin', {
        path: '/admin',
        template: 'admin',
        layoutTemplate: 'mainLayout'
    });

    this.route('reported', {
        path: '/admin/reported',
        template: 'reported',
        layoutTemplate: 'mainLayout'
    });

    this.route('find', {
        path: '/find/:type/:search',
        template: 'find',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onAfterAction: function () {
            Search(this.params.type, this.params.search);
        },
        data: function () {
            return this.params;
        }
    });

    this.route('myfoodz', {
        path: '/users/myfoods',
        template: 'myfoods',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

    this.route('add', {
        path: '/pages/add/:brand_id?',
        template: 'foodsadd',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        data: function () {
            return this.params;
        }
    });

    this.route('addRecipe', {
        path: '/pages/addrecipe',
        template: 'addRecipe',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        data: function () {

        }
    });

    this.route('brandsPage', {
        path: '/pages/brand/:_id',
        template: 'brandsTemplate',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            PARAMS = this.params;
            this.next();
        },
        data: function () {
            return {brand_id: this.params._id};
        }
    });

    this.route('foods', {
        path: '/pages/:type/:_id',
        template: 'foods',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            PARAMS = this.params;
            this.next();
        },
        data: function () {
            return {
                id: this.params._id,
                type: this.params.type.substring(0, 1).toUpperCase() + this.params.type.substring(1)
            };
        }
    });

    this.route('explore', {
        path: '/explore',
        template: 'explore',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

    this.route('explore-maptype', {
        path: '/explore/:maptype',
        template: 'explore',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            PARAMS = this.params;
            this.next();
        }
    });

    this.route('peoplesPage', {
        path: '/users/people/:username',
        template: 'people',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            PARAMS = this.params;
            this.next();
        }
    });

    this.route('wsie', {
        path: '/wsie',
        template: 'wsie',
        layoutTemplate: 'mainLayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

});

