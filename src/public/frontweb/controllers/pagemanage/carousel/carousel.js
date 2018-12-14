import "./carouselSrv";
let carouselModule = angular.module("carouselModule", ["carouselService"]);
carouselModule.controller("carouselCtrl", ["$scope", "$translate","$location","$timeout", "carouselSrv", "modalCom","$filter", function($scope, $translate, $location,$timeout, Srv, modalCom,$filter) {
        var self = $scope;
        function initList() {
            Srv.getItemList().then(function(res) {
                if (res && res.data && res.data.data) {
                    self.imgList = res.data.data;
                    self.imgList.forEach(item=>{
                        item.url = window.GLOBALCONFIG.APIHOST.AILABIMG+item.url;
                    })
                    self.canCreate = self.imgList.length<6;
                }
            })
        };

        initList();
        
        self.refresh = function() {
            initList();
        }
        self.deleteItem = function(checkedItems) {
            self.deleteCheckedItems = [checkedItems];
            let content = {
                msg: $translate.instant("cn.carousel.delItem"),
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
    

export default carouselModule.name;
