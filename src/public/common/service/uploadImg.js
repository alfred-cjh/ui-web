function init(self,type,context,$translate,currentItem){
    self.typeData = {
        "filetype":2,
        "description":""
    }
    self.dataForm = {
        num:""
    }
    var titleTran = {
        create:$translate.instant("cn.imgupload.create"),
        edit:$translate.instant("cn.imgupload.edit"),
        img:$translate.instant("cn.imgupload.img")
    }
    switch(type){
            case "paththumb"://路径列表 缩略图上传
                self.typeData.type = 1;
                self.TITLE = titleTran.img;
                self.helpMessage = $translate.instant("cn.pathlist.model.paththumb");
                self.imgUrl = currentItem[0].thumbnailUr?window.GLOBALCONFIG.APIHOST.AILABIMG+currentItem[0].thumbnailUr:'';
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/photoUpload/"+currentItem[0].id;
                break;
            case "pathbg"://路径列表 背景图上传
                self.typeData.type = 0;
                self.TITLE = titleTran.img;
                self.helpMessage = $translate.instant("cn.pathlist.model.pathbg");
                self.imgUrl = currentItem[0].backgroundUrl?window.GLOBALCONFIG.APIHOST.AILABIMG+currentItem[0].backgroundUrl:'';
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/photoUpload/"+currentItem[0].id;
                break;
            case "course"://课程列表 图片上传
                self.TITLE = titleTran.img;
                self.helpMessage = $translate.instant("cn.courselist.model.course");
                self.imgUrl = currentItem[0].imageUrl?window.GLOBALCONFIG.APIHOST.AILABIMG+currentItem[0].imageUrl:'';
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/curriculum/photoUpload/"+currentItem[0].id;
                break;
            case "platcreate"://平台特色管理 新建图片
                self.TITLE = titleTran.create;
                self.helpMessage = $translate.instant("cn.platform.model.tips");
                self.showNum = true;
                self.showDecr = true;
                self.dataForm.description = "";
                self.typeData.type = 1;
                self.typeData.filetype = 3;
                self.numMax = 4;


                //self.imgUrl = context.checkedItems[0].imageUrl?window.GLOBALCONFIG.APIHOST.AILABIMG+context.checkedItems[0].imageUrl:'';
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/addFeatureInfo";
                break;
            case "platedit"://平台特色管理 编辑图片
                self.TITLE = titleTran.edit;
                self.helpMessage = $translate.instant("cn.platform.model.tips");
                self.showNum = true;
                self.showDecr = true;
                self.typeData.type = 1;
                self.typeData.filetype = 3;
                self.numMax = 4;
                if(currentItem&&currentItem!="CREATE"){
                    self.dataForm.description = currentItem[0].description;
                    self.dataForm.num = currentItem[0].num;
                    self.dataForm.id = currentItem[0].id;
                    self.imgUrl = currentItem[0].url?currentItem[0].url:'';
                    if(self.imgUrl){
                        self.imgChecked = false;
                        self.oldUrl = self.imgUrl;
                    }else{
                        self.imgChecked = true;
                    }
                }
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/updateFeature"
                break;
            case "carouselcreate"://轮播图管理 新建图片
                self.TITLE = titleTran.create;
                self.helpMessage = $translate.instant("cn.carousel.model.tips");
                self.showNum = true;
                self.showDecr = false;
                self.typeData.type = 1;
                self.typeData.filetype = 3;
                self.numMax = 6;
                //self.imgUrl = context.checkedItems[0].imageUrl?window.GLOBALCONFIG.APIHOST.AILABIMG+context.checkedItems[0].imageUrl:'';
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/addPictureInfo";
                break;
            case "carouseledit"://轮播图管理 编辑图片
                self.TITLE = titleTran.edit;
                self.helpMessage = $translate.instant("cn.carousel.model.tips");
                self.showNum = true;
                self.showDecr = false;
                self.numMax = 6;
                if(currentItem&&currentItem!="CREATE"){
                    self.dataForm.num = currentItem[0].num;
                    self.dataForm.id = currentItem[0].id;
                    self.imgUrl = currentItem[0].url?currentItem[0].url:'';
                    if(self.imgUrl){
                        self.imgChecked = false;
                        self.oldUrl = self.imgUrl;
                    }else{
                        self.imgChecked = true;
                    }
                }
                self.modelApiUrl = window.GLOBALCONFIG.APIHOST.AILAB+"/v1/updatePicture";
                break;
        }
        if(type=="carouselcreate"||type=="carouseledit"||type=="platcreate"||type=="platedit"){
            self.repeatName = [];
            if(context.imgList){
                context.imgList.forEach(item => {
                    self.repeatName.push(item.num);
                }) 
            }
            if(type=="carouseledit"||type=="platedit"){
                for (let i = 0; i < self.repeatName.length; i++) {
                    if (self.repeatName[i] == currentItem[0].num) {
                        self.repeatName.splice(i, 1);
                    }
                }
            }
            self.changeName = function() {
                self.hadSameName = false;
                for (let i = 0; i < self.repeatName.length; i++) {
                    if (self.repeatName[i] == self.dataForm.num) {
                        self.hadSameName = true;
                    }
                }
            }
        }
}

function uploadCreate(self,uploadimgform,$rootScope,type,typeData,refresh,$uibModalInstance,dataForm){
    self.FormValid = true;
    if(!self.imgChecked&&uploadimgform.$valid&&!self.hadSameName){
        self.canClick = false;
        self.noUpload = true;

        let form = document.forms.namedItem("uploadimgform");
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
                    $uibModalInstance.close();
                });
            }
            self.$apply();
        }
        oData.append('body', JSON.stringify(typeData));
        
        switch(type){
            case 'platcreate':
                oData.append('feature', JSON.stringify(dataForm));
                break;
            case 'platedit':
                oData.append('feature', JSON.stringify(dataForm));
                break;
            case 'carouselcreate':
                oData.append('picture', JSON.stringify(dataForm));
                break;
            case 'carouseledit':
                oData.append('picture', JSON.stringify(dataForm));
                break;
        }
        oReq.open("POST", self.modelApiUrl, true);
        oReq.setRequestHeader("X-Auth-Token", auth_token);
        oReq.send(oData);
    }
}

function uploadImg($scope, refresh, Srv, $uibModalInstance, context, type,$rootScope,$translate,data) {
        var self = $scope;
        var currentItem = angular.copy(data);
        self.canClick = true;
        self.imgChecked = true;
        init(self,type,context,$translate,currentItem);


        self.fileChanged = function(e) {
            var file = e.files[0];
            if (file && ["image/png","image/gif", "image/jpeg"].indexOf(file.type) > -1) {
                self.filePath = file.name;
                var reader = new FileReader();
                reader.onload = function() {
                    self.imgUrl = this.result;
                    self.imgChecked = false;
                    //self.imgReset();
                    self.$apply();
                }
                reader.readAsDataURL(file);
            } else {
                if(self.oldUrl){
                    return;
                };
                self.imgChecked = true;
                self.imgUrl = null;
                self.filePath = null;
                $("#imgContent").attr('src','')
                self.$apply();
            }
        }
        self.upload = function(uploadimgform){
            uploadCreate(self,uploadimgform,$rootScope,type,self.typeData,refresh,$uibModalInstance,self.dataForm)
        }
        // self.upload = function(uploadimgform) {
        //     self.FormValid = true;
        //     if(!self.imgChecked){
        //         self.canClick = false;
        //         var form = document.forms.namedItem("uploadimgform");
        //         var oData = new FormData(form);
        //         oData.append('body', JSON.stringify(typeData));
        //         //oData.append('type', 0);
        //         var oReq = new XMLHttpRequest();
        //         self.noUpload = true;
        //         self.currentData = [];
        //         oReq.onerror = function(e) {
        //             $rootScope.$apply(function() {
        //                 self.noUpload = false;
        //                 $rootScope.$broadcast("ui-tag-bubble", { type: "error", code: 1 });
        //             });
        //         };
        //         oReq.onload = function() {
        //             self.canClick = true;
        //             if (oReq.status == 200) {
        //                 $rootScope.$apply(function() {
        //                     $rootScope.$broadcast("ui-tag-bubble",{type:"success",code:0});
        //                     refresh();
        //                     $uibModalInstance.close();
        //                 });
        //             }
        //             self.$apply();
        //         }
        //         //var apiUrl = 'http://' + localStorage.apiUrl+'/predict';
        //         var apiUrl = self.modelApiUrl;
        //         oReq.open("POST", apiUrl, true);
        //         let auth_token = localStorage.$LIB_AUTH_TOKEN;
        //         oReq.setRequestHeader("X-Auth-Token", auth_token);
        //         oReq.send(oData);
        //     }
        // }
    }
    uploadImg.$inject = ["$scope", "refresh", "pathlistSrv", "$uibModalInstance", "context", "type","$rootScope","$translate","data"]
export default uploadImg;