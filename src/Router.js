define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var ListController = Backbone.Router.extend({
        routes: {
            'clear/:id': 'clear',
        },

    });
    return ListController;
});
