import "./paginationSrv";
let paginationModule = angular.module("paginationModule", ["paginationService"]);
paginationModule.controller("paginationCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "paginationSrv", "TableCom", "modalCom", "$filter","pageFun", function($scope, $translate, $routeParams, $timeout, Srv, TableCom, modalCom, $filter,pageFun) {
    var self = $scope;
    var tagDa = [
        {"id":1,"name":"基础课程","createTime":1540895062000,"updateTime":1540895062000},
        {"id":2,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":3,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":4,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":5,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":6,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":7,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":8,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":9,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
        {"id":10,"name":"深度学习","createTime":1540895062000,"updateTime":1540895062000},
    ]
    self.tableData = tagDa;
    //self.PAGE_TOTAL = 2;
    pageFun.init({
      context:self,//上下文
      data:tagDa,//所有数据
      currentData:'tableData'
    })
    // self.PAGE_CURRENT_NUM = 1;
    // self.changePage = function(){
    //     console.log(self.PAGE_CURRENT_NUM);
    // }
    
}])

export default paginationModule.name;
