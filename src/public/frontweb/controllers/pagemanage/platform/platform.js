import "./platformSrv";
let platformModule = angular.module("platformModule", ["platformService"]);
platformModule.controller("platformCtrl", ["$scope", "$translate","$location","$timeout", "platformSrv", "modalCom","$filter", function($scope, $translate, $location,$timeout, Srv, modalCom,$filter) {
        var self = $scope;
        function initList() {
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.imgList = res.data.data;
                    self.imgList.forEach(item=>{
                        item.url = window.GLOBALCONFIG.APIHOST.AILABIMG+item.url;
                    })
                    self.canCreate = self.imgList.length<4;
                }
            })
        };

        initList();
        // self.imgList = [
        //     {
        //         name:"理论结合实践",
        //         id:"1",
        //         url:"/images/content/u250.png",
        //         num:"序号1"
        //     },
        //     {
        //         name:"理论结合实践",
        //         id:"2",
        //         url:"/images/content/u250.png",
        //         num:"序号1"
        //     },
        //     {
        //         name:"理论结合实践",
        //         id:"3",
        //         url:"/images/content/u250.png",
        //         num:"序号1"
        //     },
        //     {
        //         name:"理论结合实践",
        //         id:"4",
        //         url:"/images/content/u250.png",
        //         num:"序号1"
        //     }
        // ]
        self.refresh = function() {
            initList();
        }
        self.deleteItem = function(checkedItems) {
            self.deleteCheckedItems = [checkedItems];
            let content = {
                msg: $translate.instant("cn.platform.delItem"),
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
        self.createItem = function(type,item){
            modalCom.init('/public/dashboard/tmpl/uploadimg.html', 'uploadImgCtrl', {
                refresh: function() {
                    return self.refresh
                },
                context: function() {
                    return self;
                },
                type: function() {
                    return type;
                },
                data:function(){
                    if(item){
                        return [item];
                    }else{
                        return 'CREATE'
                    }
                }
            })
        }
    }])
    

export default platformModule.name;
