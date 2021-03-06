angular.module('xue.table', ['xue.util.lang', 'xue.pagination', 'xue.util.array'])
    .directive('xueTable', ['xueUtilLang', 'xueUtilArray', '$timeout', function (xueUtilLang, xueUtilArray, $timeout) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                tableConfig: '='
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'xue/template/table/table.html';
            },
            link: function (scope, ele, attrs) {

                //assist var
                var assistVar = {
                    resetPageFlag: 0,
                    unbindWatch1: null,
                    unbindWatch2: null,
                    unbindWatch3: null,
                    unbindWatch4: null
                }

                //common table config 
                var tableConfig = {
                    defaultNull: '无', //当data为undefined时默认显示文字
                    pagination: true, //显示分页
                    maxSize: 5, //分页最大选项数
                    page: 1, //当前页
                    pagesize: true, //显示分页信息
                    size: 10, //当前页记录数
                    pageList: [10, 25, 50, 100, 150, 200], //设置分页size
                    total: 0, //总记录数
                    optConfig: [], //操作列配置
                    optConfigExt: [], //扩展操作列配置
                    colunms: [], //表头
                    uniqueId: 'id', //唯一标识字段名
                    noDataText: '暂无数据', //暂无数据显示文字
                    nodataColspan: 1, // 无数据时表格合并列的数量
                    showIndex: false, //显示序号
                    indexTitle: '序号', //序号表头标题
                    rows: [], //表记录
                    checkbox: false, //多选
                    radio: false, //单选
                    selectAll: false, //是否全选
                    checkRows: [], //选中记录
                    checkRowsMap: {}, //选中记录map
                    order: false, //排序
                    orderColumn: '', //默认排序列
                    desc: false, //排序规则
                    tableHover: true, //是否显示划过变色效果
                    showTableCol: false, //是否显示选项
                    drag: false, //是否支持拖动表格列宽
                    selectAllColumn: true, //是否全选列显示
                    rowDbclick: function () {}, //行双击回调
                    rowClick: function () {}, //行单击回调
                    turnPage: function () {}, //分页回调
                    resetPage: function () { //重置page为1，并阻止turnPage回调
                        if (this.page != 1) {
                            this.page = 1;
                            assistVar.resetPageFlag = 1;
                        }
                    },
                    toolbar: { //一般工具栏
                        show: false,
                        title: '列表',
                        tools: [{
                                text: '刷新',
                                icon: 'fa fa-refresh',
                                permissionCode: '',
                                noPermission: true,
                                callback: function () {

                                }
                            },
                            {
                                text: '上传',
                                icon: 'fa fa-upload',
                                permissionCode: '',
                                callback: function () {}
                            },
                            {
                                text: '下载',
                                icon: 'fa fa-download',
                                permissionCode: '',
                                callback: function () {}
                            },
                            {
                                text: '导入',
                                icon: 'fa fa-sign-in',
                                permissionCode: '',
                                callback: function () {}
                            },
                            {
                                text: '导出',
                                icon: 'fa fa-sign-out',
                                permissionCode: '',
                                callback: function () {}
                            }
                        ]
                    }
                };

                //初始化表头
                angular.forEach(scope.tableConfig.colunms, function (item, index) {
                    if (typeof (item.show) == 'undefined') {
                        item.show = true;
                    }
                });

                //extend
                scope.tableConfig = angular.extend(tableConfig, scope.tableConfig);

                //布局样式 0：全表格 1：表格+分页 2:表格+toolbar 3：表格+toolbar+分页
                scope.layout = 0;
                if (scope.tableConfig.pagination || scope.tableConfig.toolbar.show) {
                    scope.layout = scope.tableConfig.pagination ? 1 : 2;
                    if (scope.tableConfig.pagination && scope.tableConfig.toolbar.show) {
                        scope.layout = 3;
                    }
                }

                //翻页监听
                assistVar.unbindWatch1 = scope.$watch('tableConfig.page + tableConfig.size', function (newValue, oldValue) {
                    scope.tableConfig.selectAll = false;
                    if (!assistVar.resetPageFlag) {
                        if (xueUtilLang.isFunction(scope.tableConfig.turnPage)) {
                            scope.tableConfig.turnPage(scope.tableConfig.page, scope.tableConfig.size);
                        }
                    } else {
                        assistVar.resetPageFlag = 0;
                    }
                });

                //格式化
                assistVar.unbindWatch2 = scope.$watch('tableConfig.rows', function (newValue, oldValue) {
                    //列格式化
                    angular.forEach(scope.tableConfig.colunms, function (item, index) {
                        if (xueUtilLang.isFunction(item.formatter)) {
                            angular.forEach(scope.tableConfig.rows, function (list, i) {
                                if (item.formatter(list) && typeof (item.formatter(list).then) == 'function') {
                                    // (function (paramList, paramI) {
                                    //     item.formatter(paramList).then(function (ret) {
                                    //         paramList[item.name] = ret;
                                    //     }, function () {
                                    //         paramList[item.name] = '';
                                    //     });
                                    // })(list, i);
                                } else {
                                    list[item.name] = item.formatter(list) || '';
                                }
                            })
                        }
                        if (tableConfig.checkbox && scope.tableConfig.rows && scope.tableConfig.rows.length) {
                            tableConfig.selectAll = true;
                            angular.forEach(scope.tableConfig.rows, function (list, i) {
                                if (scope.tableConfig.checkRowsMap) {
                                    list.$checked = scope.tableConfig.checkRowsMap[list[scope.tableConfig.uniqueId]];
                                } else {
                                    list.$checked = false;
                                }
                                tableConfig.selectAll = tableConfig.selectAll && list.$checked;
                            })
                        }
                    });
                    //操作列格式化
                    angular.forEach(scope.tableConfig.optConfigExt, function (item, index) {
                        angular.forEach(item.optContent, function (list, i) {
                            if (xueUtilLang.isFunction(list.formatter)) {
                                angular.forEach(scope.tableConfig.rows, function (row, j) {
                                    var show = list.formatter(row);
                                    row[list.id] = show;
                                });
                            }
                        });
                    });
                });

                // 同步checkRows
                var syncCheckRows = function () {
                    //同步map
                    scope.tableConfig.checkRowsMap = {};
                    angular.forEach(scope.tableConfig.checkRows, function (item, index) {
                        scope.tableConfig.checkRowsMap[item[scope.tableConfig.uniqueId]] = true;
                    });
                    //同步选中状态、判断是否全选
                    var isSelectAll = true;
                    angular.forEach(scope.tableConfig.rows, function (item, index) {
                        if (scope.tableConfig.checkRowsMap[item[scope.tableConfig.uniqueId]]) {
                            item.$checked = true;
                        } else {
                            item.$checked = false;
                            isSelectAll = false;
                        }
                    });
                    scope.tableConfig.selectAll = isSelectAll;
                }

                //单选radio
                scope.selectRadio = function (row) {
                    scope.tableConfig.checkRows = [];
                    scope.tableConfig.checkRows.push(row);
                    syncCheckRows();
                }
                //单选
                scope.selectSingle = function (row) {
                    if (!row.$checked) {
                        scope.checkOne(row);
                    } else {
                        scope.disCheck(row);
                    }
                }
                //全选、取消全选
                scope.selectAll = function () {
                    scope.tableConfig.selectAll = !scope.tableConfig.selectAll;
                    if (scope.tableConfig.selectAll) {
                        angular.forEach(scope.tableConfig.rows, function (item, i) {
                            if (!scope.tableConfig.checkRowsMap[item[scope.tableConfig.uniqueId]]) {
                                scope.tableConfig.checkRows.push(item);
                            }
                        });
                    } else {
                        scope.tableConfig.checkRows = [];
                    }
                    syncCheckRows();
                }
                scope.disCheck = function (row) {
                    var index = xueUtilArray.findObjIndex(scope.tableConfig.checkRows, scope.tableConfig.uniqueId, row[scope.tableConfig.uniqueId]);
                    scope.tableConfig.checkRows.splice(index, 1);
                    syncCheckRows();
                }
                scope.checkOne = function (row) {
                    if (!scope.tableConfig.checkRowsMap[row[scope.tableConfig.uniqueId]]) {
                        scope.tableConfig.checkRows.push(row);
                        syncCheckRows();
                    }
                }
                //排序
                scope.order = function (item) {
                    if (scope.tableConfig.order) {
                        scope.tableConfig.orderColumn = item.name;
                        scope.tableConfig.desc = !scope.tableConfig.desc;
                    }
                }
                //单击行
                scope.rowClick = function (row, event) {
                    if (scope.clicked) {
                        scope.cancelClick = true;
                        return;
                    }

                    scope.clicked = true;

                    $timeout(function () {
                        if (scope.cancelClick) {
                            scope.cancelClick = false;
                            scope.clicked = false;
                            return;
                        }

                        if (!(event.target.attributes['data-event'] && event.target.attributes['data-event'].value == 'notChecked') &&
                            $(event.target).parents().attr('data-event') != 'notChecked') {
                            if (scope.tableConfig.checkbox) {
                                scope.selectSingle(row);
                            }
                            if (scope.tableConfig.radio) {
                                scope.selectRadio(row);
                            }
                        }

                        if (xueUtilLang.isFunction(scope.tableConfig.rowClick)) {
                            scope.tableConfig.rowClick(row);
                        }

                        scope.cancelClick = false;
                        scope.clicked = false;
                    }, 200);
                };
                //双击行
                scope.rowDbclick = function (row, event) {
                    $timeout(function () {

                        if (xueUtilLang.isFunction(scope.tableConfig.rowDbclick)) {
                            scope.tableConfig.rowDbclick(row);
                        }

                    });
                };
                //单击列
                scope.colClick = function (row, $event, click) {
                    if (xueUtilLang.isFunction(click)) {
                        click(row);
                        $event.stopPropagation();
                    }
                }
                //单击无权限功能
                scope.noPermission = function () {
                    // modalExt.modalTip({
                    //     content: "暂无权限!",
                    //     type: "warning",
                    //     height: 150
                    // });
                }

                /**
                 * 弹窗业务
                 */
                var popup = scope.popup = {
                    //是否全选
                    isSelectAll: true,
                    //全选
                    selectAll: function () {
                        if (scope.tableConfig.selectAllColumn) {
                            scope.tableConfig.selectAllColumn = false;
                        } else {
                            scope.tableConfig.selectAllColumn = true;
                        }
                        // scope.tableConfig.selectAllColumn ? scope.tableConfig.selectAllColumn = false : scope.tableConfig.selectAllColumn = true;
                        angular.forEach(scope.tableConfig.colunms, function (item, index) {
                            item.show = scope.tableConfig.selectAllColumn;
                        });
                        scope.tableConfig.nodataColspan = scope.tableConfig.selectAllColumn ? scope.tableConfig.colunms.length : 0;
                    },
                    //单选
                    singleSelect: function (item) {
                        item.show = !item.show;
                        if (item.show) {
                            scope.tableConfig.nodataColspan++;
                        } else {
                            scope.tableConfig.nodataColspan--;
                        }
                        // item.show ? scope.tableConfig.nodataColspan++ : scope.tableConfig.nodataColspan--;
                        var allChecked = true;
                        angular.forEach(scope.tableConfig.colunms, function (colItem, index) {
                            if (!colItem.show) {
                                allChecked = false;
                            }
                        });
                        scope.tableConfig.selectAllColumn = allChecked;
                    }
                }
                // 默认无数据时合并列为表头数量
                scope.tableConfig.nodataColspan = scope.tableConfig.colunms.length;

                /**
                 * 拖拽功能
                 */
                var drag = scope.drag = {
                    direct: 0,
                    originOffsetX: 0,
                    originWidth: 0,
                    originName: "",
                    lastWidth: 0,
                    nextWidth: 0,
                    inArea: false,
                    moving: false,
                    listener: function () {
                        $(ele).on('mousemove', 'th', function (event) {
                            var $this = $(this),
                                $next = $(this).next(),
                                $last = $(this).prev();
                            if (drag.moving && $next.length && event.offsetX > 0) {
                                if (drag.originName != $this.html()) {
                                    drag.direct = 1;
                                    drag.originName = $this.html();
                                    drag.originWidth = $this.width();
                                    drag.originOffsetX = event.offsetX;
                                    drag.lastWidth = $last.width();
                                }
                                if (drag.direct) {
                                    /* console.log('往后拽:'+ (event.offsetX-drag.originOffsetX));
                                    console.log('前一列宽：'+drag.lastWidth);
                                    console.log('后一列宽'+drag.originWidth); */
                                    //往后拽
                                    $last.width(drag.lastWidth + (event.offsetX - drag.originOffsetX));
                                    $this.width(drag.originWidth - (event.offsetX - drag.originOffsetX));
                                } else {
                                    /* console.log('往前拽:'+ (event.offsetX-drag.originOffsetX));
                                    console.log('前一列宽：'+drag.originWidth);
                                    console.log('后一列宽'+drag.nextWidth); */
                                    //往前拽
                                    $next.width(drag.nextWidth - (event.offsetX - drag.originOffsetX));
                                    $this.width(drag.originWidth + (event.offsetX - drag.originOffsetX));
                                }
                            } else {
                                if (($this.width() - event.offsetX) < 10) {
                                    $this.css('cursor', 'e-resize');
                                    drag.inArea = true;
                                } else {
                                    $this.css('cursor', 'default');
                                    drag.inArea = false;
                                }
                            }
                        });
                        $(ele).on('mousedown', 'th', function (event) {
                            var $this = $(this),
                                $next = $(this).next();
                            if (drag.inArea && $next.length) {
                                drag.moving = true;
                                drag.direct = 0;
                                drag.originWidth = $this.width();
                                drag.nextWidth = $next.width();
                                drag.originOffsetX = event.offsetX;
                                drag.originName = $this.html();
                            } else {
                                drag.moving = false;
                            }
                        });
                        $(ele).on('mouseleave', 'tr', function () {
                            drag.moving = false;
                        });
                        $(ele).on('mouseup', function (event) {
                            drag.moving = false;
                        });
                    }
                }
                if (scope.tableConfig.drag) {
                    drag.listener();
                    //支持拖拽则不支持排序，容易造成点击失误
                    scope.tableConfig.order = false;
                }

                //销毁
                scope.$on("$destroy", function () {
                    assistVar.unbindWatch1();
                    assistVar.unbindWatch2();
                    $(ele).off('mousemove');
                    $(ele).off('mousedown');
                    $(ele).off('mouseup');
                    $(ele).remove();
                })
            }
        };
    }])
    .filter('trusthtml', ['$sce', function ($sce) {
        return function (text, defaultNull) {
            var showText = defaultNull || '';
            //过滤<script></script>
            if (text) {
                var str = text.toString();
                text = str.replace("<script>", "");
                text = text.replace("</script>", "");
            } else {
                text = '';
            }
            if (text == '') {
                return $sce.trustAsHtml(showText);
            } else {
                if (text && isNaN(text)) {
                    return $sce.trustAsHtml(text);
                } else {
                    return $sce.trustAsHtml('<span>' + text + '</span>');
                }
            }
        }
    }]);