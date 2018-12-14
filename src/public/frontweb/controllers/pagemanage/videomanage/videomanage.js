import "./videomanageSrv";
let videomanageModule = angular.module("videomanageModule", ["videomanageService"]);
videomanageModule.controller("videomanageCtrl", ["$scope", "$translate","$location","$timeout", "videomanageSrv", "modalCom","$filter","TableCom", function($scope, $translate, $location,$timeout, videomanageSrv, modalCom,$filter,TableCom) {
    var self= $scope ;
    self.videomanageTitles = {
        "name": $translate.instant("cn.videomanage.dataTitles.name"),
        "desc": $translate.instant("cn.videomanage.dataTitles.desc"),
        "download": $translate.instant("cn.videomanage.dataTitles.download"),
    }
   
    function getDataSetList(){
        self.globalSearchTerm = "";      
        videomanageSrv.getItemList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.dataSetList = res.data.data
                self.dataSetList.forEach(function(item){
                    // item.picUrl = window.GLOBALCONFIG.APIHOST.AILABIMG + item.picUrl
                    item.searchTerm = [item.videoName,item.description,item.videoUrl].join("\b");  
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

    self.createOrEdit = function(type){
        self.createItemModal = modalCom.init('createDatas.html', 'createVideoCtrl', {
            refresh: function() {
                return getDataSetList
            },
            context: function() {
                return self;
            },
            type:()=>type
        })
    }

    self.delete = (checkedItems)=>{
        self.deleteItemCheckedItems = checkedItems;
        let content = {
            msg: $translate.instant("cn.videomanage.delRes"),
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
            videomanageSrv.delItem(ids).then(res => {
                getDataSetList();
            })
        };
    }

    self.$on("getDetail", function (event, value) {
        videomanageSrv.getItemList().then(function(res){
            if(res&&res.data&&res.data.data){
                self.dataSetList = res.data.data
                self.dataSetList.forEach(function(item){
                    if(item.id == value ){
                        item.picUrl = window.GLOBALCONFIG.APIHOST.AILABIMG + item.picUrl
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
videomanageModule.controller("createVideoCtrl", ["$scope","$rootScope", "videomanageSrv", "refresh",'$uibModalInstance','context','$translate','type', function ($scope, $rootScope ,videomanageSrv, refresh,$uibModalInstance,context,$translate,type) {
    let self = $scope;
    self.canClick = true;
    self.noUpload = true;
    
    if(type=='edit'){
        self.redSpan = false
        self.modalTitle = $translate.instant("cn.videomanage.editItem");
        self.checkedItems = context.checkedItems[0]
        self.formData = angular.copy(self.checkedItems)
        self.picUrl = window.GLOBALCONFIG.APIHOST.AILABIMG + self.formData.picUrl;
        self.formData.filePath = ' ';
    }else{
        self.redSpan = true
        self.modalTitle = $translate.instant("cn.videomanage.createItem");
        self.formData = {filePath : ''};
    }
    self.helpMessage = $translate.instant("cn.videomanage.imgTips");
    self.fileChanged = function(e) {
        var file = e.files[0];
        if (file && ["image/png","image/gif", "image/jpeg"].indexOf(file.type) > -1) {
            self.formData.filePath = file.name;
            var reader = new FileReader();
            reader.onload = function() {
                self.picUrl = this.result;
                self.imgChecked = false;
                //self.imgReset();
                self.$apply();
            }
            reader.readAsDataURL(file);
        } else {
            self.imgChecked = true;
            self.picUrl = null;
            self.filePath = null;
            $("#imgContent").attr('src','')
            self.$apply();
        }
    }

    self.confirmCreate = function (fromName) {
        if (!self.imgChecked && fromName.$valid) {
            self.canClick = false;
            self.noUpload = true;
            var option = {
                "videoName": self.formData.videoName,
                "videoUrl": self.formData.videoUrl,
                "description": self.formData.description
            }
            let form = document.forms.namedItem("createItemForm");
            let oData = new FormData(form);
            let oReq = new XMLHttpRequest();
            let auth_token = localStorage.$LIB_AUTH_TOKEN;
            oReq.onerror = function(e) {
                $rootScope.$apply(function() {
                    self.noUpload = false;
                    $rootScope.$broadcast("ui-tag-bubble", { type: "error", code: 1 });
                });
            };

            oReq.onload = function() {
                self.canClick = true;
                if (oReq.status == 200) {
                    $rootScope.$apply(function() {
                        $rootScope.$broadcast("ui-tag-bubble",{type:"success",code:0});
                        refresh();
                        context.createItemModal.close();
                    });
                }
                self.$apply();
            }


            if(type == 'edit'){
                option.id = self.formData.id
                oData.append('body', JSON.stringify(option));
                oReq.open("POST", window.GLOBALCONFIG.APIHOST.AILAB+"/v1/updatevideo", true);
            }else{
                oData.append('body', JSON.stringify(option));
                oReq.open("POST", window.GLOBALCONFIG.APIHOST.AILAB+"/v1/video", true);
            }
            oReq.setRequestHeader("X-Auth-Token", auth_token);
            oReq.send(oData);
        } else {
            self[fromName.$name + "Valid"] = true;
        }
    }
}]); 
export default videomanageModule.name;



