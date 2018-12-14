import resViewSrvModule from './resourceviewSrv';

let resourceviewModule = angular.module("resourceviewModule", ["resViewSrvModule"]);
resourceviewModule.controller("resourceviewCtrl",["$scope" ,"$rootScope" ,"$translate","resViewSrv",function(scope,rootScope,$translate,resViewSrv){
    var self= scope ;
    self.clusterData = {
        total:"0",
        chartTitle:"实验环境数",
        colorList:["#1abc9c","#4e80f5","#f39c12","#e74c3c","#b6a2dd","#666666","#4a6583"],
        chartData:[
            {
                value:0
            },{
                value:0
            },
            {
                value:0
            },
            {
                value:0
            },{
                value:0
            },
            {
                value:0
            },
            {
                value:0
            }
        ],
        // clusterData:{
        //     finish:"0",
        //     error:"0",
        //     createing:0,
        //     stoping:0,
        //     scheduleing:0,
        //     running:0,
        //     deleting:0
        // },
        clusterData:{
            "total":{
                value:0,
                name:'total' 
            },
            "3_status":{
                value:0,
                name:'error',
                color:"#e74c3c"
            },
            "0_status":{
                value:0,
                name:'running',
                color:"#1abc9c"
            },
            "4_status":{
                value:0,
                name:'createing',
                color:"#b6a2dd"
            },
            "1_status":{
                value:0,
                name:'scheduleing',
                color:"#4e80f5"
            },
            "5_status":{
                value:0,
                name:'deleting',
                color:"#666"
            },
            "2_status":{
                value:0,
                name:'finish',
                color:"#f39c12"
            },
            "6_status":{
                value:0,
                name:'stoping',
                color:"#4a6583"
            }
        }
    }
    
    self.quotaData = {
        cpu:{
            total:0,
            inUsed:0,
            unit:"个",
            label:"CPU核"
        },
        memory:{
            total: 0,
            inUsed:0,
            unit:"GB",
            label:"内存"
        },
        storage:{
            total: 0,
            inUsed:0,
            unit:"GB",
            label:"存储卷"
        },
        gpu:{
            inUsed:0,
            total:0,
            unit:"个",
            label:"GPU"
        },
    };
    
        
    
    function getResource(){
        resViewSrv.getResource().then(function(res){
            if(res && res.data && res.data.data){
                var quota = res.data.data.usage;
                var tasks = res.data.data.tasks;
                self.quotaData = {
                    cpu:{
                        total:quota.cpu,
                        inUsed:quota.cpu_used,
                        unit:"个",
                        label:"CPU核"
                    },
                    memory:{
                        total: quota.memory,
                        inUsed:quota.memory_used,
                        unit:"GB",
                        label:"内存"
                    },
                    storage:{
                        total: quota.disk,
                        inUsed:quota.disk_used,
                        unit:"GB",
                        label:"存储卷"
                    },
                    gpu:{
                        total:quota.gpu,
                        inUsed:quota.gpu_used,
                        unit:"个",
                        label:"GPU"
                    },
                };

                if(tasks&&tasks.length>0){
                    self.clusterData.total = tasks.length;
                    var statusMap = {
                        0:4,//创建中-创建中
                        1:3,//创建失败-错误
                        2:0,//运行中-运行
                        5:1,//调度中-调度中
                        6:6,//终止中-终止中
                        7:2,//已终止-已终止
                        8:3,//终止失败-错误
                        9:3,//重新训练失败-错误
                        10:3,//继续训练失败-错误
                        11:0,//到时限自动终止-运行
                        12:5,//删除中-删除中
                        13:3,//删除失败-错误
                    }
                    tasks.forEach(item=>{
                        self.clusterData.chartData[statusMap[item.taskrunstatus]].value+=1;
                        self.clusterData.clusterData[statusMap[item.taskrunstatus]+"_status"].value = self.clusterData.chartData[statusMap[item.taskrunstatus]].value
                    })
                    self.clusterData.clusterData.total.value = tasks.length;
                }
                
            }
        })
    }
    getResource();
    
}])
.controller("initCtrl",["$scope","globalMenuModule","$location","$rootScope",function($scope,globalMenuModule,$location,$rootScope){
    var self = $scope;
    if(localStorage.roleId){
        if(localStorage.roleId==4){
            window.location.href = "/#/";
        }else{
            $location.url(globalMenuModule[localStorage.roleId+"_PERMIT"][0])
        }
    }else{
        $rootScope.checkLogin.loginAction("backend");
    }
    
}]);


export default resourceviewModule.name;