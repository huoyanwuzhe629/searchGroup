define(['../src/view/CpcGroup','../src/model/CpcGroup', '../src/Router','backbone'], function(CpcView, CpcModel, CpcRoute, Backbone) {　　　　 // some code here
    var cpcModel = new CpcModel();
    var cpcView = new CpcView({model: cpcModel});
    var cpcRoute = new CpcRoute;
    cpcRoute.on('route:remove', function() {
        cpcView.model.destroy();
    });
    cpcRoute.on('route:search', function(channel) {
        var params = JSON.parse(JSON.stringify(cpcView.model.get('params')));
        params.channel = channel;
        cpcView.model.set({params: params});
        cpcView.model.filter();
    });
    cpcRoute.on('route:clear', function() {
        cpcView.filterView.clear();
    });
    Backbone.history.start();　　
});

