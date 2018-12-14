let comModule = angular.module("comModule",[
    "ngTable",
    "ui.bootstrap"
])
.service("TableCom",["NgTableParams",function(NgTableParams){
    var watchCk,ckAll,pageChange;
    this.init = function(context,tableName,data,uid,page=10,checkboxes="checkboxes"){
        context[checkboxes] = { 
            checked: false,//全选按钮
            items: {}//所有当前页数据的checkbox选中状态
        };

        context[checkboxes] = {
            checked: false,//全选按钮
            items: {}//所有当前页数据的checkbox选中状态
        };
        context[tableName] = new NgTableParams({ count: page }, { counts: [], dataset: data });
            // if(watchCk){//清除监控
            //   watchCk()
            // }
            // if(ckAll){//清除监控
            //   ckAll();
            // }
            // if(pageChange){//清除监控
            //   pageChange()
            // }
      //监控每条数据的checkbox
        watchCk = context.$watch(function(){
            return context[checkboxes].items;
        },function(ne){
            if(!ne){
                return;
            }
            var _length = context[tableName].data.length;
            var checked = 0,uncheck;
            
            //如果选中的数据在当前页面才加一
            context[tableName].data.forEach(item=>{
                if(context[checkboxes].items[item[uid]]){
                    checked+=1;
                }
            })
            if((checked>=_length)&&checked&&_length){
                context[checkboxes].checked = true;
            }
            if(_length==0||checked==0){
                context[checkboxes].checked = false;
            }
            angular.element(".table[ng-table="+tableName+"]").find(".select-all").prop("indeterminate", (checked != 0 && checked != _length));
            
        },true);
        //监控全选的checkbox
        angular.element(".table[ng-table="+tableName+"]").find(".select-all").on("click",function(){
            //context[checkboxes].checked =!context[checkboxes].checked;
            context[tableName].data.forEach(item=>{
                context[checkboxes].items[item[uid]] = context[checkboxes].checked;
            });
            context.$apply();
        })

      //监控ngtable的页码
        pageChange = context.$watch(function(){
            return context[tableName].page();
        },function(ne){//翻页之后全选状态取消
            context[checkboxes] = {
                checked: false,
                items: {}
            };
        });
        context.$watch(function(){
            return context[tableName].data
        },function(ne){
            var _length = context[tableName].data.length;
            var checked = 0,uncheck;
            
            context[tableName].data.forEach(item=>{
                if(context[checkboxes].items[item[uid]]){
                    checked+=1;
                }
            })
            
            if((checked>=_length)&&checked&&_length){
                context[checkboxes].checked = true;
            }
            if(_length==0||checked==0){
                context[checkboxes].checked = false;
            }
            angular.element(".table[ng-table="+tableName+"]").find(".select-all").prop("indeterminate", (checked != 0 && checked != _length));
        })
    };
    return this;
}])
.service("modalCom",["$uibModal",function($uibModal){
    this.init = function(template,controller,resolve){
        var modalInstance = $uibModal.open({
            templateUrl:template,
            backdrop:"static",
            controller:controller,
            resolve:resolve?resolve:null,
        });
        return modalInstance;
    };
    return this;
}]);

export default comModule.name;