define(['jquery', 'underscore', 'backbone', '../model/CpcGroup', 'bizUi', 'mustache', 'text!tpl/CpcGroup.tpl'], function($, _, Backbone, Item, bizui, Mustache, tpl) {
    var FilterView = Backbone.View.extend({
        template: tpl,
        events: {
            'click input:radio': 'selectArea',
            'click input:checkbox': 'selectCity',
            'keyup input': 'setParams',
            'click button#search': 'search',
            'click button#clear': 'clear',
            'change select': 'selectChannel'
        },
        initialize: function() {
            var self = this;
            Mustache.parse(self.template);
            // self.model = new Item();
            // self.model.on('change', self.render);
            self.model.bind('change:params', self.render, self);
            self.model.bind('remove', self.unrender, self);
            $.ajax({
                type: 'GET',
                url: '/mock/data.json',
                data: '233',
                dataType: 'json',
                success: function(data) {
                    self.model.set({ result: data.data });
                    self.render();
                }
            });
        },
        render: function() {
            var self = this;
            $(self.el).html(Mustache.render(self.template, this.model.toJSON()));
            $(':radio').bizRadio();
            $('input:checkbox', self.el).bizCheckbox();
            // $('#channel').val(self.model.get('params').channel);
            $('.calendar').bizCalendar({
                onChange: function(e) {
                    self.model.set({
                        beginTime: $('#beginTime').val(),
                        endTime: $('#endTime').val()
                    });
                }
            });
            $('.control button').bizButton();

            // table = self.initTable(self.model.get('result').slice(0, 10));
            // var resultNum = self.model.get('result').length;
            // self.initPage(resultNum, table);
            return this;
        },
        selectArea: function(e) {
            var self = this;
            var areaType = $(e.target).val();
            var areaDict = {
                allArea: ['beijing', 'tianjin'],
                selectArea: []
            };
            var params = JSON.parse(JSON.stringify(self.model.get('params')));
            params.area = areaType;
            params.city = areaDict[areaType];
            self.model.set({
                params: params
            });
            console.log(self.model);
        },
        selectCity: function(e) {
            var self = this;
            var cityList = [];
            $('input:checkbox', self.el).each(function(index, el) {
                if ($(el).prop('checked')) {
                    cityList.push($(this).val());
                }
            });
            var params = JSON.parse(JSON.stringify(self.model.get('params')));
            params.city = cityList;
            self.model.set({ params: params });
        },
        selectChannel: function() {
            var self = this;
            var params = JSON.parse(JSON.stringify(self.model.get('params')));
            params.channel = $('#channel').val();
            self.model.set({ params: params });
        },
        setParams: function() {
            var self = this;
            var params = JSON.parse(JSON.stringify(self.model.get('params')));
            params.groupName = $('#groupName').val();
            params.priceFrom = $('#priceFrom').val();
            params.priceTo = $('#priceTo').val();
            self.model.set({ params: params });
        },
        search: function() {
            var self = this;

            if (!self.model.isValid()) {
                alert(self.model.validationError);
            }
            $.when($.ajax({
                type: 'GET',
                url: '/mock/data.json',
                data: '',
                dataType: 'json',

            })).done(function(data) {
                var filterList = data.data;
                filterList = _.filter(filterList, function(item) {
                    var flag = true;
                    if (self.model.get('params').groupName !== '') {
                        if (item.groupName.indexOf(self.model.get('params').groupName) === -1) {
                            flag = false;
                        }
                    }

                    var regionDict = {
                        '01': ['tianjin'],
                        '10': ['beijing'],
                        '11': ['beijing', 'tianjin']
                    };
                    if (self.model.get('params').city.toString().indexOf(regionDict[item.region].toString()) === -1) {
                        flag = false;
                    }
                    var channelDict = {
                        shoppingSearch: '购物搜索',
                        dsp: 'dsp',
                        sohu: '搜狐微门户',
                        qqNav: 'qq导航页',
                        sogouPhoneticize: '搜狗拼音'
                    }
                    if (self.model.get('params').channel) {
                        if (item.channel !== channelDict[self.model.get('params').channel]) {
                            flag = false;
                        }
                    }

                    if (self.model.get('params').beginTime !== '') {
                        var filterDate = Date.parse(new Date(self.model.get('params').beginTime));
                        var resultDate = Date.parse(new Date(item.startDate));
                        if (filterDate > resultDate) {
                            flag = false;
                        }
                    }
                    if (self.model.get('params').endTime !== '') {
                        var filterDate = Date.parse(new Date(self.model.get('params').endTime));
                        var resultDate = Date.parse(new Date(item.endDate));
                        if (filterDate < resultDate) {
                            flag = false;
                        }
                    }
                    if (self.model.get('params').priceFrom !== '') {
                        if (item.price < self.model.get('params').priceFrom) {
                            flag = false;
                        }
                    }
                    if (self.model.get('params').priceTo !== '') {
                        if (item.price > self.model.get('params').priceTo) {
                            flag = false;
                        }
                    }
                    return flag;
                });
                self.model.set({ result: filterList });
            });
        },
        clear: function() {
            var self = this;
            self.initialize();
        }
    });

    var ResultView = Backbone.View.extend({
        template: $('#result-tpl').html(),
        events: {},
        initialize: function() {
            var self = this;
            self.model.bind('change:result', self.render, self);
            // self.render();
        },
        initTable: function(data) {
            var self = this;
            var column = [{
                field: 'groupName',
                title: '推广组',
                align: 'left',
                content: function(item, index, field) {
                    return item.groupName;
                }

            }, {
                field: 'region',
                title: '地域',
                align: 'left',
                content: function(item, index, field) {
                    var regionDict = {
                        '01': '天津',
                        '10': '北京',
                        '11': '北京 天津'
                    }
                    return regionDict[item.region];
                }
            }, {
                field: 'channel',
                title: '频道',
                // currentSort: 'des',
                align: 'left',
                content: function(item, index, field) {
                    return item.channel;
                }
            }, {
                field: 'startDate',
                title: '开始时间',
                // editable: true,
                sortable: true,
                // currentSort: 'des',
                align: 'right',
                content: function(item, index, field) {
                    return item.startDate;
                },
            }, {
                field: 'endDate',
                title: '结束时间',
                sortable: true,
                align: 'right',
                content: function(item, index, field) {
                    return item.endDate;
                },
            }, {
                field: 'budget',
                title: '预算',
                sortable: true,
                align: 'right',
                content: function(item, index, field) {
                    return item.budget;
                }
            }, {
                field: 'price',
                title: '出价',
                sortable: true,
                align: 'right',
                content: function(item, index, field) {
                    return item.price;
                },
            }, {
                field: 'clickRate',
                title: '点击率',
                sortable: true,
                align: 'right',
                content: function(item, index, field) {
                    ret = (Math.round(item.clickRate * 10000) / 100).toFixed(2) + '%'
                    return ret;
                },
            }, {
                field: 'clickCount',
                title: '点击量',
                sortable: true,
                align: 'right',
                content: function(item, index, field) {
                    return item.clickCount;
                },
            }, {
                field: 'status',
                title: '状态',
                align: 'left',
                escapeContent: false,
                content: function(item, index, field) {
                    if (item.status === '有效') {
                        return '<font color="green">' + item.status + '</font>';
                    } else {
                        return '<font color="brown">' + item.status + '</font>';
                    }
                },
            }];
            var table = new bizui.Table($('.list'), {
                column: column,
                data: data,
                noDataContent: '<p>没有找到符合条件推广组</p>',
                skin: 'myTable',
                onSort: function(data, e) {
                    var result = this.getData().sort(function(a, b) {
                        if (data.field === 'startDate' || data.field === 'endDate') {
                            a['sort'] = Date.parse(new Date(a[data.field]));
                            b['sort'] = Date.parse(new Date(b[data.field]));
                        } else {
                            a['sort'] = a[data.field];
                            b['sort'] = b[data.field];
                        }
                        if (data.des) {
                            return b['sort'] - a['sort'];
                        } else {
                            return a['sort'] - b['sort'];
                        }
                    });
                    this.updateData(result);
                },
            });
            return table;
        },
        initPage: function(resultNum, table) {
            var self = this;
            $('.page').bizPage({
                pageSize: 10,
                pageNumber: 1,
                totalNumber: resultNum,
                onPageClick: function(pageNumber) {
                    var showList = self.model.get('result');
                    var endNum;
                    if (resultNum > 10 * pageNumber) {
                        endNum = 10 * pageNumber;
                    } else {
                        endNum = resultNum;
                    }
                    showList = showList.slice((pageNumber - 1) * 10, endNum);
                    table.updateData(showList);
                }
            });

        },
        render: function() {
            var self = this;
            $(self.el).html(Mustache.render(self.template, self.model.toJSON()));
            table = self.initTable(self.model.get('result').slice(0, 10));
            var resultNum = self.model.get('result').length;
            self.initPage(resultNum, table);
            return this;
        }
    });
    var CpcView = Backbone.View.extend({
        el: $('main'),
        initialize: function () {
            var self = this;
            self.model = new Item();
            self.filterView = new FilterView({model: self.model});
            self.resultView = new ResultView({model: self.model});
            self.render();
        },
        render: function () {
            var self = this;
            $('#filterContext', self.el).html(self.filterView.render().el);
            $('#resultList', self.el).html(self.resultView.render().el);
            return this;

        },
    });
    return CpcView;
});
