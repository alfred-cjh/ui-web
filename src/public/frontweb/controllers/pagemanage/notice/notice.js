import "./noticeSrv";
import readFileMd from "../../../../common/service/readFilePreview"
let noticeModule = angular.module("noticeModule", ["noticeService"]);
noticeModule.controller("noticeCtrl", ["$scope", "$translate","$location","$timeout", "noticeSrv", "modalCom","$filter","TableCom", function($scope, $translate, $location,$timeout, Srv, modalCom, $filter,TableCom) {
        var self = $scope;
        //table翻译
        self.dataTitles = {
            name: $translate.instant("cn.notice.dataTitles.name"),
            createTime: $translate.instant("cn.notice.dataTitles.createTime"),
            decr: $translate.instant("cn.notice.dataTitles.decr")
        }
        self.watched = '';


        //监听checkbox
        function watchCheck(self) {
            var watch = self.$watch(function() {
                return self.checkboxes.items;
            }, function(val) {
                self.checkedItems = [];
                var arr = [];
                for (var i in self.checkboxes.items) {
                    arr.push(self.checkboxes.items[i]);
                }
                self.canEdit = null;
                self.canManageUser = null;
                self.canDel = null;
                if (val && arr.length >= 0) {
                    for (var key in val) {
                        if (val[key]) {
                            self.tableParams.data.forEach(item => {
                                if (item.id == key) {
                                    self.checkedItems.push(item);
                                }
                            });
                        }
                    }
                }
                if (self.checkedItems.length == 1) {
                    self.canEdit = true;
                    self.canDel = true;
                } else if (self.checkedItems.length == 0) {
                    self.canEdit = false;
                    self.canDel = false;
                } else if (self.checkedItems.length > 1) {
                    self.canEdit = false;
                    self.canDel = true;
                }
            }, true);
            return watch;
        }

        self.applyGlobalSearch = function() {
            var term = self.globalSearchTerm;
            self.tableParams.filter({ searchTerm: term });
        };

        function initList() {
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.tableData = res.data.data;
                    self.tableData.forEach(item => {
                        item.createTime = $filter("date")(item.createTime, "yyyy-MM-dd HH:mm:ss");
                        item.searchTerm = [item.title, item.createTime, item.content];
                        item.searchTerm = item.searchTerm.join("\b");
                    })
                    TableCom.init(self, "tableParams", self.tableData, "id", 10)
                    if (self.watched) {
                        self.watched();
                    }
                    self.watched = watchCheck(self);
                }
            })
            self.globalSearchTerm = "";
        };

        initList();

        self.refresh = function() {
            initList();

        }
        self.createItem = function(type) {
            if(type=="edit"){
                $location.url(`/pagemanage/notice/${self.checkedItems[0].id}`)
            }else{
                $location.url("/pagemanage/notice/new")
            }
        }
        
        self.deleteItem = function(checkedItems) {
            self.deleteCheckedItems = angular.copy(checkedItems);
            let content = {
                msg: $translate.instant("cn.notice.delItem"),
                type: "warning",
                func: "confirmDeleteItem"
            };
            self.$emit("ui-tag-alert", content);
        };
        self.confirmDeleteItem = function() {
            var data = self.deleteCheckedItems.map(item=>{return item.id})
            data = data.join(",")
            Srv.delItem(data).then(() => {
                initList();
            });
        };
    }])
    .controller("noticeDetailCtrl",noticeDetail);
    function noticeDetail($scope, $translate, $location,$timeout, Srv, modalCom,$routeParams,$route){
        var self = $scope;
        if(!$routeParams.id){
            return;
        }
        self.form = {
            title:"",
            content:""
        }
        self.canCreate = true;
        self.currentEditor = {
            instan:""
        };
        if($routeParams.id=="new"){
            self.docData = self.form.content;
            self.showMarkdown = true;
        }else{
            Srv.getDetail($routeParams.id).then(function(res){
                if(res&&res.data&&res.data.data){
                    self.form = res.data.data;
                    self.docData = self.form.content;
                    self.showMarkdown = true;
                }
            })
        }
        self.saveForm = function(form){
            self.FormValid = true;
            self.markdownChange(self.currentEditor.instan);
            if(form.$valid&&!self.markdownChecked){
                self.canCreate = false;
                self.form.content = self.currentEditor.instan.getMarkdown();
                if($routeParams.id=="new"){
                    Srv.createItem(self.form).then(function(res){
                        if(res&&res.data&&res.data.data){
                            $location.url("/pagemanage/notice");
                        }
                    }).finally(function(){
                        self.canCreate = true;
                    })
                }else{
                    Srv.editItem(self.form).then(function(res){
                        if(res&&res.data&&res.data.data==0){
                            //$route.reload();
                            $location.url("/pagemanage/notice");
                        }
                    }).finally(function(){
                        self.canCreate = true;
                    })
                }
            }
        }
        // self.fileChanged = function(e) {
        //     var file = e.files[0];
        //     var reg = /\.md$/;
        //     self.filePath = file.name;
        //     if (file && reg.test(file.name)) {
        //         self.imgChecked = false;
        //         var reader = new FileReader();
        //         reader.onload = function() {
        //             self.imgUrl = this.result;
        //             self.currentEditor.instan.clear()
        //             self.currentEditor.instan.setValue(this.result)
        //             self.imgChecked = false;
        //             //self.imgReset();
        //             self.$apply();
        //         }
        //         reader.readAsText(file);
        //     } else {
        //         self.imgChecked = true;
        //     }
        //     self.$apply();
        // }
        self.fileChanged = function(e){
            readFileMd(self,e,'md');
        }
        self.markdownChange = function(markdown){
            if(!markdown.getMarkdown().replace(/^\s+|\s+$/g,"")||markdown.getMarkdown().length>1000){
                self.markdownChecked = true;
            }else{
                self.markdownChecked = false;
            }
        }
        
    }
    noticeDetail.$inject = ["$scope", "$translate","$location","$timeout", "noticeSrv", "modalCom","$routeParams","$route"]
export default noticeModule.name;
