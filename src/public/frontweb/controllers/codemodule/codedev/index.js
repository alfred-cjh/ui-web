
let codedevModule = angular.module("codedevModule", []);
codedevModule.controller("codedevCtrl", ["$scope", "$translate", "$routeParams", "$timeout", "TableCom", "modalCom","$filter","codedevSrv", 
    function($scope, $translate, $routeParams, $timeout, TableCom, modalCom,$filter,Srv) {
        var self = $scope;
        //table翻译
          self.currentEditor = {
              instan:""
          };
        function initList() {
            Srv.getItemList().then(function(res){
              if(res){
                self.docData = res;
                self.showMarkdown = true;
              }
            })
            self.globalSearchTerm = "";
        };

        initList();
    }]).service("codedevSrv",["$http",function($http){
        return {
            getItemList: function () {
                return $http({
                    method: "GET",
                    url: '/md/datestruct.md'
                });
            }
        }
    }])
export default codedevModule.name;
