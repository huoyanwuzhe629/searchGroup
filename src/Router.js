define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var ListController = Backbone.Router.extend({
        routes: {
            'remove/:id': 'remove',
            'search/:channel': 'search',
            'clear': 'clear',
        },

    });
    return ListController;
});
