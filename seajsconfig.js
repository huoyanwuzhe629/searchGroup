//modify js url to include version
(function() {
    var version = new Date().getDate();
    seajs.config({
        alias: {
            "jquery": "dep/jquery/1.9.1/jquery.js"
        },
        base: '',
        preload: [],
        map: [
            [/\.js$/, '.js?v=' + version]
        ],
        charset: 'utf-8'
    });
})();