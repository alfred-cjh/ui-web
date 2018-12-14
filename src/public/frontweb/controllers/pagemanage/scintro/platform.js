import "./scintroSrv";
let scintroModule = angular.module("scintroModule", ["scintroService"]);
scintroModule.controller("scintroCtrl", ["$scope", "$translate","$location","$timeout", "scintroSrv", "modalCom","$filter", function($scope, $translate, $location,$timeout, Srv, modalCom,$filter) {
        var self = $scope;
        function initList() {
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.tableData = res.data.data;
                    // self.imgList = [
                    //     {
                    //         name:"理论结合实践",
                    //         id:"1",
                    //         url:"/public/images/content/u250.png",
                    //         num:"序号1"
                    //     },
                    //     {
                    //         name:"理论结合实践",
                    //         id:"2",
                    //         url:"/public/images/content/u250.png",
                    //         num:"序号1"
                    //     },
                    //     {
                    //         name:"理论结合实践",
                    //         id:"3",
                    //         url:"/public/images/content/u250.png",
                    //         num:"序号1"
                    //     }
                    // ]
                }
            })
        };

        //initList();
        self.imgList = [
            {
                name:"理论结合实践",
                id:"1",
                url:"/images/content/u250.png",
                num:"序号1"
            },
            {
                name:"理论结合实践",
                id:"2",
                url:"/images/content/u250.png",
                num:"序号1"
            },
            {
                name:"理论结合实践",
                id:"3",
                url:"/images/content/u250.png",
                num:"序号1"
            },
            {
                name:"理论结合实践",
                id:"4",
                url:"/images/content/u250.png",
                num:"序号1"
            }
        ]
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
    

export default scintroModule.name;
