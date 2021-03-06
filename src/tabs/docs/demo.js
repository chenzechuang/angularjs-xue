angular.module('ui.xue.demo').controller('xueTabsDemoCtrl', ['$scope', function ($scope) {
    $scope.vm = {
        activeValue1: 1,
        activeValue2: 2,
        select: function($event,$selectedIndex,$selected){
            console.log($event,$selectedIndex,$selected);
        },
        deselect: function($event,$selectedIndex,$previousSelected){
            console.log($event,$selectedIndex,$previousSelected);
        },
        tabItems: [{
            id: 1,
            name: '标签一',
            content: '标签一的内容'
        },{
            id: 2,
            name: '标签二',
            content: '标签二的内容'
        },{
            id: 3,
            name: '标签三',
            content: '标签三的内容'
        },{
            id: 4,
            name: '标签四',
            content: '标签四的内容'
        }]
    }
}]);