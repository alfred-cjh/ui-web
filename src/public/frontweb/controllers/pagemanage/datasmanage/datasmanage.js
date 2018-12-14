import "./datasmanageSrv";
let datasmanageModule = angular.module("datasmanageModule", ["datasmanageService"]);
datasmanageModule.controller("datasmanageCtrl", ["$scope", "$translate","$location","$timeout", "datasmanageSrv", "modalCom","$filter","TableCom", function($scope, $translate, $location,$timeout, datasmanageSrv, modalCom,$filter,TableCom) {
    var self= $scope ;
    self.datasmanageTitles = {
        "name": $translate.instant("cn.datasmanage.dataTitles.name"),
        "desc": $translate.instant("cn.datasmanage.dataTitles.desc"),
        "download": $translate.instant("cn.datasmanage.dataTitles.download"),
    }

    function getDataSetList(){
        self.globalSearchTerm = "";      
        datasmanageSrv.getItemList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.dataSetList = res.data.data
                self.dataSetList.forEach(function(item){
                    item.searchTerm = [item.datasetName,item.description,item.url].join("\b");  
                })   
                TableCom.init(self, "tableParams", self.dataSetList, "id", 10,"checkboxes");                            
            }
        })
    }
    getDataSetList()

    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };

    self.create = function(){
        modalCom.init('createDatas.html', 'createDatasCtrl', {
            refresh: function() {
                return getDataSetList
            },
            context: function() {
                return self;
            },
            type:()=>'create'
        })
    }
    self.edit = (checkedItems)=>{
        modalCom.init('createDatas.html', 'createDatasCtrl', {
            refresh: function() {
                return getDataSetList
            },
            context: function() {
                return self;
            },
            checkedItems: function(){
                return checkedItems
            },
            type:()=>'edit'

        })
    }
    self.delete = (checkedItems)=>{
        self.deleteItemCheckedItems = checkedItems;
        let content = {
            msg: $translate.instant("cn.datasmanage.delRes"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            var option = [];
            self.deleteItemCheckedItems.forEach(element => {
                option.push(element.id);
            });
            let ids = option.join(',')
            datasmanageSrv.delItem(ids).then(res => {
                getDataSetList();
            })
        };
    }

    self.$on("getDetail", function (event, value) {
        datasmanageSrv.getItemList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.dataList = res.data.data
                self.dataList.forEach(function(item){
                    if(item.id == value ){
                        self.detailInfo = item
                    }
                })                           
            }
        })
    });

    self.refresh = function(){
        getDataSetList()
    }

    self.$watch("checkboxes.items", val => {
        self.checkedItems = [];
        for (var i in val) {
            if (val[i]) {
                self.tableParams.data.forEach(item => {
                    if (item.id == i) {
                        self.checkedItems.push(item);
                    }
                });
            }
        }
        if (self.checkedItems.length == 1) {
            self.canEdit = true
            self.canDelete = true
        } else if (self.checkedItems.length > 1) {
            self.canEdit = false
            self.canDelete = true
        } else {
            self.canEdit = false
            self.canDelete = false
        }
    },true);
}])
datasmanageModule.controller("createDatasCtrl", ["$scope", "datasmanageSrv", "refresh",'$uibModalInstance','context','type', function ($scope, datasmanageSrv, refresh,$uibModalInstance,context,type) {
    var self = $scope;
    self.repeatList = [...context.dataSetList];

    function initDatas(){
        if(type=='create'){
            self.modalTitle = '新建数据集'
        }else{
            self.modalTitle = '编辑数据集'
            self.formData = angular.copy(context.checkedItems[0]);
            self.repeatList.forEach((item)=>{
                if(item.datasetName==self.formData.datasetName){
                    self.repeatList.splice(item,1)
                }
            })
        }
    };
    initDatas()
    
    self.changeName = function(value) {
        self.hadSameName = false;
        self.hadSameName = self.repeatList.some((item)=>{
            return item.datasetName == value
        })
    }
    self.confirm = function (formName) {
        if (formName.$valid&&!self.hadSameName) {
            if(type=='create'){
                datasmanageSrv.createItem(self.formData).then(res => {
                    refresh();
                });
            }else{
                datasmanageSrv.editItem(self.formData).then(res => {
                    refresh();
                });
            }
            $uibModalInstance.close();
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);   
export default datasmanageModule.name;



