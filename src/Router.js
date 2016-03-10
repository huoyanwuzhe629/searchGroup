define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var ListController = Backbone.Router.extend({
        routes: {
            clear: function() { cpcView.remove(); },
            // show: 'showList',
        },
        // showList: function () {
        //     var path = '../mock/data.json';
        //     $.getJSON(path, function(data) {
        //         console.log(data);
        //         return data.data;
        //     });
        // }

    });
    return ListController;
});
