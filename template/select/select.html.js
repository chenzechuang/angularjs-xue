angular.module("xue/template/select/select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xue/template/select/select.html",
    "<div class=\"xui-select-warp\">\n" +
    "    <!-- 单选可过滤不分离 -->\n" +
    "    <div ng-if=\"!selectConfig.checkbox && selectConfig.filter && !selectConfig.separate\">\n" +
    "        <input ng-focus=\"focus()\" type=\"text\" class=\"select-show\" title=\"{{selectConfig.inputLabel}}\"\n" +
    "            ng-model=\"selectConfig.inputLabel\" ng-class=\"selectClass\" ng-style=\"showStyle\" ng-change=\"changeIpt()\"\n" +
    "            ng-disabled=\"selectConfig.disabled\" />\n" +
    "        <div class=\"select-content\" ng-style=\"contentStyle\">\n" +
    "            <ul class=\"select-list\">\n" +
    "                <li ng-click=\"onBeforeSelect(item,$event)\"\n" +
    "                    ng-class=\"{true:'active'}[item[selectConfig.valueField] == selectConfig.value]\"\n" +
    "                    ng-repeat=\"item in selectConfig.data | filter:selectConfig.inputLabel  | limitTo:selectConfig.showLimit\">\n" +
    "                    <span ng-bind=\"item[selectConfig.textField] || textFieldFormat(item)\"></span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"!!!selectConfig.data || !selectConfig.data.length\" class=\"empty-data\">\n" +
    "                    <span>暂无数据</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <iframe title=\"\"></iframe>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- 单选可过滤且分离 -->\n" +
    "    <div ng-if=\"!selectConfig.checkbox && selectConfig.filter && selectConfig.separate\">\n" +
    "        <input ng-click=\"focus()\" type=\"button\" class=\"select-show\" ng-disabled=\"selectConfig.disabled\"\n" +
    "            title=\"{{selectConfig.inputLabel}}\" ng-class=\"selectClass\" ng-style=\"showStyle\" />\n" +
    "        <div class=\"select-content select-content-checkbox select-separate\" ng-style=\"contentStyle\">\n" +
    "            <div class=\"separate-wrap\" ng-class=\"{'hidden-filter':!selectConfig.enableEmpty}\">\n" +
    "                <div class=\"select-filter-wrap\">\n" +
    "                    <input type=\"text\" ng-model=\"selectConfig.myLabel\" class=\"select-filter form-control\" />\n" +
    "                </div>\n" +
    "                <i ng-click=\"clear()\" ng-if=\"selectConfig.enableEmpty\" title=\"清空\" class=\"fa fa-trash\"></i>\n" +
    "            </div>\n" +
    "            <ul class=\"select-list\">\n" +
    "                <li ng-click=\"onBeforeSelect(item,$event)\"\n" +
    "                    ng-class=\"{true:'active'}[item[selectConfig.valueField] == selectConfig.value]\"\n" +
    "                    ng-repeat=\"item in selectConfig.data | filter:selectConfig.myLabel  | limitTo:selectConfig.showLimit\">\n" +
    "                    <span ng-bind=\"item[selectConfig.textField] || textFieldFormat(item)\"></span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"!!!selectConfig.data || !selectConfig.data.length\" class=\"empty-data\">\n" +
    "                    <span>暂无数据</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <iframe title=\"\"></iframe>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- 单选不可过滤且分离 -->\n" +
    "    <div ng-if=\"!selectConfig.checkbox && !selectConfig.filter\">\n" +
    "        <input ng-focus=\"focus()\" type=\"button\" class=\"select-show\" title=\"{{selectConfig.inputLabel}}\"\n" +
    "            ng-class=\"selectClass\" ng-style=\"showStyle\" ng-disabled=\"selectConfig.disabled\" />\n" +
    "        <div class=\"select-content\" ng-style=\"contentStyle\">\n" +
    "            <ul class=\"select-list\">\n" +
    "                <li ng-click=\"onBeforeSelect(item,$event)\"\n" +
    "                    ng-class=\"{true:'active'}[item[selectConfig.valueField] == selectConfig.value]\"\n" +
    "                    ng-repeat=\"item in selectConfig.data | limitTo:selectConfig.showLimit\">\n" +
    "                    <span ng-bind=\"item[selectConfig.textField] || textFieldFormat(item)\"></span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"!!!selectConfig.data || !selectConfig.data.length\" class=\"empty-data\">\n" +
    "                    <span>暂无数据</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <iframe title=\"\"></iframe>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- 多选-->\n" +
    "    <div ng-if=\"selectConfig.checkbox && selectConfig.filter\">\n" +
    "        <input ng-click=\"focus()\" type=\"button\" class=\"select-show\" ng-disabled=\"selectConfig.disabled\"\n" +
    "            title=\"{{selectConfig.inputLabel}}\" ng-class=\"selectClass\" ng-style=\"showStyle\" />\n" +
    "        <div class=\"select-content select-content-checkbox  select-separate\" ng-style=\"contentStyle\">\n" +
    "            <div class=\"separate-wrap\">\n" +
    "                <div class=\"select-filter-wrap\">\n" +
    "                    <input type=\"text\" ng-model=\"selectConfig.myLabel\" class=\"select-filter form-control\" />\n" +
    "                </div>\n" +
    "                <i ng-click=\"clear()\" ng-if=\"selectConfig.enableEmpty\" title=\"清空\" class=\"fa fa-trash\"></i>\n" +
    "            </div>\n" +
    "            <ul ng-style=\"showContent\" class=\"select-list\">\n" +
    "                <li ng-click=\"selectLi(item,$event)\"\n" +
    "                    ng-class=\"{true:'active'}[!!selectConfig.checkRowsMap[item[selectConfig.valueField]]]\"\n" +
    "                    ng-repeat=\"item in selectConfig.data | filter:selectConfig.myLabel | limitTo:selectConfig.showLimit\">\n" +
    "                    <gx-checkbox ng-checked=\"selectConfig.checkRowsMap[item[selectConfig.valueField]]\"></gx-checkbox>\n" +
    "                    <span ng-bind=\"item[selectConfig.textField] || textFieldFormat(item)\"></span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"!!!selectConfig.data || !selectConfig.data.length\" class=\"empty-data\">\n" +
    "                    <span>暂无数据</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <iframe title=\"\"></iframe>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- 多选不可过滤-->\n" +
    "    <div ng-if=\"selectConfig.checkbox && !selectConfig.filter\">\n" +
    "        <input ng-click=\"focus()\" type=\"button\" class=\"select-show\" ng-disabled=\"selectConfig.disabled\"\n" +
    "            ng-class=\"selectClass\" ng-style=\"showStyle\" />\n" +
    "        <div class=\"select-content  select-separate\" ng-style=\"contentStyle\">\n" +
    "            <ul ng-style=\"showContent\" class=\"select-list\">\n" +
    "                <li ng-click=\"selectLi(item,$event)\"\n" +
    "                    ng-class=\"{true:'active'}[!!selectConfig.checkRowsMap[item[selectConfig.valueField]]]\"\n" +
    "                    ng-repeat=\"item in selectConfig.data | filter:selectConfig.myLabel | limitTo:selectConfig.showLimit\">\n" +
    "                    <gx-checkbox ng-checked=\"selectConfig.checkRowsMap[item[selectConfig.valueField]]\"></gx-checkbox>\n" +
    "                    <span ng-bind=\"item[selectConfig.textField] || textFieldFormat(item)\"></span>\n" +
    "                </li>\n" +
    "                <li ng-if=\"!!!selectConfig.data || !selectConfig.data.length\" class=\"empty-data\">\n" +
    "                    <span>暂无数据</span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <iframe title=\"\"></iframe>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);