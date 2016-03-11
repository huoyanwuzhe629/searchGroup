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
            $.ajax({
                type: 'GET',
                url: '/mock/data.json',
                data: '233',
                dataType: 'json',
                success: function(data) {
                    self.set({ result: data.data });
                }
            });

        },
        filter: function() {
            var self = this;
            $.ajax({
                type: 'GET',
                url: '/mock/data.json',
                data: '233',
                dataType: 'json',
                success: function(data) {
                    var filterList = data.data;
                    filterList = _.filter(filterList, function(item) {
                        return self.filterItem(item);
                    });
                    self.set({ result: filterList });
                }
            });
        },
        filterItem: function(item) {
            var self = this;
            var flag = true;
            if (self.get('params').groupName !== '') {
                if (item.groupName.indexOf(self.get('params').groupName) === -1) {
                    flag = false;
                }
            }
            var regionDict = {
                '01': ['tianjin'],
                '10': ['beijing'],
                '11': ['beijing', 'tianjin']
            };
            if (self.get('params').city.toString().indexOf(regionDict[item.region].toString()) === -1) {
                flag = false;
            }
            var channelDict = {
                shoppingSearch: '购物搜索',
                dsp: 'dsp',
                sohu: '搜狐微门户',
                qqNav: 'qq导航页',
                sogouPhoneticize: '搜狗拼音'
            }
            if (self.get('params').channel) {
                if (item.channel !== channelDict[self.get('params').channel]) {
                    flag = false;
                }
            }
            if (self.get('params').beginTime !== '') {
                var filterDate = Date.parse(new Date(self.get('params').beginTime));
                var resultDate = Date.parse(new Date(item.startDate));
                if (filterDate > resultDate) {
                    flag = false;
                }
            }
            if (self.get('params').endTime !== '') {
                var filterDate = Date.parse(new Date(self.get('params').endTime));
                var resultDate = Date.parse(new Date(item.endDate));
                if (filterDate < resultDate) {
                    flag = false;
                }
            }
            if (self.get('params').priceFrom !== '') {
                if (item.price < self.get('params').priceFrom) {
                    flag = false;
                }
            }
            if (self.get('params').priceTo !== '') {
                if (item.price > self.get('params').priceTo) {
                    flag = false;
                }
            }
            return flag;
        },
        validate: function(attrs, options) {
            if (Date.parse(new Date(attrs.params.endTime)) < Date.parse(new Date(attrs.params.beginTime))) {
                return '结束时间不能早于开始时间！';
            }
            if ((attrs.params.priceFrom - 0) !== '' && (attrs.params.priceTo - 0) !== '' && (attrs.params.priceTo - 0) < (attrs.params.priceFrom - 0)) {
                return '出价后框不能小于前框！';
            }
        }
    });
    return Item;
});
