define(['jquery', 'underscore', 'backbone', 'bizUi', 'mustache', 'text!tpl/CpcGroup.tpl'], function($, _, Backbone, bizui, Mustache, tpl) {
    var FilterView = Backbone.View.extend({
        template: tpl,
        events: {
            'click input:radio': 'selectArea',
            'click button#search': 'search',
            'click button#clear': 'clear',
        },
        initialize: function() {
            var self = this;
            Mustache.parse(self.template);
            self.model.bind('change:params', self.render, self);
            self.model.bind('destroy', self.unrender, self);
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
            $('input:text', self.el).bizInput();
            $(':radio', self.el).bizRadio();
            $('input:checkbox', self.el).bizCheckbox();
            $('#channel').val(self.model.get('params').channel);
            $('.calendar').bizCalendar();
            $('.control button').bizButton();
            return this;
        },
        unrender: function() {
            var self = this;
            self.el.remove();
        },
        selectArea: function(e) {
            var self = this;
            var areaType = $(e.target).val();
            if (areaType === 'allArea') {
                $('input:checkbox', self.el).bizCheckbox('disable');
                $('input:checkbox', self.el).bizCheckbox('check');
            } else {
                $('input:checkbox', self.el).bizCheckbox('enable');
                $('input:checkbox', self.el).bizCheckbox('uncheck');
            }
        },
        setParams: function() {
            var self = this;
            var areaType = '';
            $('input:radio', self.el).each(function(index, el) {
                if ($(el).prop('checked')) {
                    areaType = $(el).val();
                } 
            });
            var cityList = [];
            $('input:checkbox', self.el).each(function(index, el) {
                if ($(el).prop('checked')) {
                    cityList.push($(this).val());
                }
            });
            var params = {
                groupName: $('#groupName').val(),
                area: areaType,
                city: cityList,
                channel: $('#channel').val(),
                beginTime: $('#beginTime').val(),
                endTime: $('#endTime').val(),
                priceFrom: $('#priceFrom').val(),
                priceTo: $('#priceTo').val(),
            };
            self.model.set({ params: params });
        },
        search: function() {
            var self = this;
            self.setParams();
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
            var paramsDefault = JSON.parse(JSON.stringify(self.model.defaults.params));
            self.model.set({ params: paramsDefault });
        }
    });

    var ResultView = Backbone.View.extend({
        template: $('#result-tpl').html(),
        events: {},
        initialize: function() {
            var self = this;
            self.model.bind('change:result', self.render, self);
            self.model.bind('destroy', self.unrender, self);
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
                align: 'left',
                content: function(item, index, field) {
                    return item.channel;
                }
            }, {
                field: 'startDate',
                title: '开始时间',
                sortable: true,
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
        },
        unrender: function() {
            var self = this;
            self.el.remove();
        }
    });
    var CpcView = Backbone.View.extend({
        el: $('main'),
        initialize: function () {
            var self = this;
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
