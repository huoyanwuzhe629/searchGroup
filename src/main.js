define(['../src/view/CpcGroup', '../src/Router','backbone'], function(CpcView, CpcController, Backbone) {　　　　 // some code here
        Backbone.sync = function(method, model, success, error) {
        console.log(success);
        console.log(error);
        success();
    }

    var cpcView = new CpcView();
    new CpcController();
    Backbone.history.start();　　
});

