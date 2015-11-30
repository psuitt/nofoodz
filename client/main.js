Router.configure({
    layoutTemplate: 'mainlayout'
});

Router.map(function () {

    this.route('home', {
        path: '/',
        template: 'home',
        layoutTemplate: 'mainlayout'
    });

    this.route('error.404', {
        path: '/error/404',
        template: 'error404',
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

    this.route('admin', {
        path: '/admin',
        template: 'admin',
        layoutTemplate: 'mainlayout'
    });

    this.route('reported', {
        path: '/admin/reported',
        template: 'reported',
        layoutTemplate: 'mainlayout'
    });

    this.route('find', {
        path: '/find/:type/:search',
        template: 'find',
        layoutTemplate: 'mainlayout',
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
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

    this.route('add', {
        path: '/pages/add/:brand_id?',
        template: 'foodsadd',
        layoutTemplate: 'mainlayout',
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
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        data: function () {

        }
    });

    this.route('brandsPage', {
        path: '/pages/brand/:_id',
        template: 'brandsTemplate',
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            this.next();
        },
        data: function () {
            return this.params;
        }
    });

    this.route('foods', {
        path: '/pages/:type/:_id',
        template: 'foods',
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            this.next();
        },
        data: function () {
            return this.params;
        }
    });

    this.route('explore', {
        path: '/explore',
        template: 'explore',
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

    this.route('explore-maptype', {
        path: '/explore/:maptype',
        template: 'explore',
        layoutTemplate: 'mainlayout',
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
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        onBeforeAction: function () {
            this.next();
        },
        data: function () {
            return this.params;
        }
    });

    this.route('wsie', {
        path: '/wsie',
        template: 'wsie',
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        }
    });

    this.route('top.gaming', {
        path: '/top/gaming',
        template: 'gaming',
        layoutTemplate: 'mainlayout',
        yieldTemplates: {
            'footer': {to: 'footer'}
        },
        data: function () {
            return this.params;
        }
    });

});

