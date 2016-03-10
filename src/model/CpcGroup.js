define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var listResult = [];
    var Item = Backbone.Model.extend({
        defaults: {
            params: {
                groupName: '',
                area: 'allArea',
                city: ['beijing', 'tianjin'],
                channel: '',
                beginTime: '',
                endTime: '',
                priceFrom: '',
                priceTo: '',
            },
            result: [],
        },
        initialize: function() {
            var self = this;
            self.set({
                isAllArea: self.get('params').area === 'allArea',
                isSelectArea: self.get('params').area === 'selectArea',
                isBeijing: $.inArray('beijing', self.get('params').city) !== -1,
                isTianjin: $.inArray('tianjin', self.get('params').city) !== -1
            });
            self.on('change:params', function() {
                self.set({
                    isAllArea: self.get('params').area === 'allArea',
                    isSelectArea: self.get('params').area === 'selectArea',
                    isBeijing: $.inArray('beijing', self.get('params').city) !== -1,
                    isTianjin: $.inArray('tianjin', self.get('params').city) !== -1
                });
            });

        },
        validate: function(attrs, options) {
            if (Date.parse(new Date(attrs.params.endTime)) < Date.parse(new Date(attrs.params.beginTime))) {
                return '结束时间不能早于开始时间！';
            }
            if ((attrs.params.priceFrom-0) !== '' && (attrs.params.priceTo-0) !== '' && (attrs.params.priceTo-0) < (attrs.params.priceFrom-0)) {
                return '出价后框不能小于前框！';
            }
        }
    });
    return Item;
});
