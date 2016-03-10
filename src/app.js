require.config({
    baseUrl: '../',
    paths: {　　　　
        jquery: 'dep/jquery/2.2.1/jquery.min',
        underscore: 'dep/underscore/1.8.3/underscore-min',
        backbone: 'dep/backbone/1.3.1/backbone-min',
        mustache: 'dep/mustache/2.2.1/mustache.min'　,
        bizUi: 'dep/biz-ui/1.2.0/jquery.bizui.min',
        text: 'dep/require/2.1.22/text'　
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        mustache: {
            exports: 'Mustache'
        },
   
    }
});

require(['../src/main']);