define(['../src/view/CpcGroup','../src/model/CpcGroup', '../src/Router','backbone'], function(CpcView, CpcModel, CpcRoute, Backbone) {　　　　 // some code here
    var cpcModel = new CpcModel();
    var cpcView = new CpcView({model: cpcModel});
    var cpcRoute = new CpcRoute;
    cpcRoute.on('route:clear', function(id) {
        console.log(id);
        cpcView.model.destroy();
    });
    Backbone.history.start();　　
});

