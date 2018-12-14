import "./libintroSrv";
import readFileMd from "../../../../common/service/readFilePreview"
let libintroModule = angular.module("libintroModule", ["libintroService"]);
libintroModule.controller("libintroCtrl", ["$scope", "$translate","$location","$timeout", "libintroSrv", "modalCom","$filter","$route", function($scope, $translate, $location,$timeout, Srv, modalCom,$filter,$route) {
    var self = $scope;
    
    self.canCreate = true;
    self.form = {};
    function initList() {
        Srv.getItemList().then(function(res) {
            if (res && res.data && res.data.data) {
                self.form = res.data.data[0];
                self.docData = self.form.description;
                self.showMarkdown = true;
            }
        })
    };
    self.currentEditor = {
        instan:""
    };
    initList();
    // self.docData = 'ddd';
    // self.showMarkdown = true;
    self.saveForm = function(){
        self.markdownChange(self.currentEditor.instan);
        if(!self.markdownChecked){
            self.canCreate = false;
            var data = {};
            data.id = self.form.id;
            data.description = self.currentEditor.instan.getMarkdown();
            Srv.editItem(data).then(function(res) {
                if (res && res.data && res.data.data==0) {
                    $route.reload();
                }
            }).finally(function(){
                self.canCreate = true;
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
    self.markdownChange = function(markdown){
        if(!markdown.getMarkdown().replace(/^\s+|\s+$/g,"")||markdown.getMarkdown().length>1000){
            self.markdownChecked = true;
        }else{
            self.markdownChecked = false;
        }
    }
}])
export default libintroModule.name;
