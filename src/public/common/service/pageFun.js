let pageFunModule = angular.module("pageFunModule",[
    
])
.service("pageFun",pageFun)
function pageFun($http,$rootScope,modalCom){
    this.option = {
        context:null,//上下文
        pageCurrentNum:'PAGE_CURRENT_NUM',//当前页数变量名
        pageCurrentCount:'PAG_CURRENT_COUNT',//每页面显示条目数变量名
        pageCurrentCountValue:8,//每页面显示条目数
        pageTotal:"PAGE_TOTAL",//总页数变量名
        data:[],//所有数据
        currentData:null,
        changePageFun:'changePage'
    }
    this.PAG_CURRENT_COUNT = 8;
    this.init = function(option){
        this.option = angular.extend(this.option,option);


        var self = this.option.context;
        var sourceData = angular.copy(this.option.data);
        var PAGE_CURRENT_NUM = this.option.pageCurrentNum;
        var PAG_CURRENT_COUNT = this.option.pageCurrentCount;
        var PAGE_TOTAL = this.option.pageTotal;
        var CURRENT_DATA = this.option.currentData;
        var changePage = this.option.changePageFun;


        self[PAGE_CURRENT_NUM] = 1;
        self[PAG_CURRENT_COUNT]= option.pageCurrentCountValue||this.PAG_CURRENT_COUNT;
        self[PAGE_TOTAL] = Math.ceil(sourceData.length/self[PAG_CURRENT_COUNT]);
        self[CURRENT_DATA] = sourceData.slice((self[PAGE_CURRENT_NUM]-1)*self[PAG_CURRENT_COUNT],self[PAGE_CURRENT_NUM]*self[PAG_CURRENT_COUNT]);
        self[changePage] = function(){
            if(self[PAGE_CURRENT_NUM]>self[PAGE_TOTAL]){
                console.log(`current page is${self[PAGE_CURRENT_NUM]},is > ${self[PAGE_TOTAL]}`);
                return;
            }
            console.log(self[PAGE_CURRENT_NUM]);
            self[CURRENT_DATA] = sourceData.slice((self[PAGE_CURRENT_NUM]-1)*self[PAG_CURRENT_COUNT],self[PAGE_CURRENT_NUM]*self[PAG_CURRENT_COUNT]);
        }
    }
}
pageFun.$inject = ["$http","$rootScope","modalCom"]

export default pageFunModule.name;