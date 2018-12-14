import "./scintroSrv";
import readFileMd from "../../../../common/service/readFilePreview"
let scintroModule = angular.module("scintroModule", ["scintroService"]);
scintroModule.controller("scintroCtrl", ["$scope", "$translate","$location","$timeout", "scintroSrv","$route", function($scope, $translate, $location,$timeout, Srv,$route) {
        var self = $scope;
        function initList() {
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.dataForm = res.data.data[0];
                    self.showMarkdown = true;
                    self.docData = self.dataForm.description;
                }
            })
        };
        initList();
        self.canSave = true;
        self.currentEditor = {
            instan:""
        }
        self.saveForm = function(createForm){
            self.FormValid = true;
            self.markdownChange(self.currentEditor.instan);
            if(createForm.$valid&&!self.markdownChecked){
                self.canSave = false;
                self.dataForm.description = self.currentEditor.instan.getMarkdown();
                Srv.editItem(self.dataForm).then(function(res){
                    $route.reload();
                }).finally(function(){
                    self.canSave = true;
                })
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
        // self.$watch(function(){
        //     return self.currentEditor.instan.getMarkdown();
        // },function(ne){
        //     if(!ne){
        //         return;
        //     }
        //     if(ne.length>1000){
        //         self.markdownChecked = true;
        //     }else{
        //         self.markdownChecked = false;
        //     }
        // },true)
        self.markdownChange = function(markdown){
            if(!markdown.getMarkdown().replace(/^\s+|\s+$/g,"")||markdown.getMarkdown().length>1000){
                self.markdownChecked = true;
            }else{
                self.markdownChecked = false;
            }
        }
    }])
    

export default scintroModule.name;
