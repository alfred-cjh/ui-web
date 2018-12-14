let checkLoginModule = angular.module("checkLoginModule",[
    
])
.service("checkLogin",["$http","$rootScope","modalCom","$uibModalStack",function($http,$rootScope,modalCom,$uibModalStack){
    this.getAuthStat = function(){
        $http({
            method:"GET",
            url:"ailab-manager/v1/tag"
        }).then(function(res){
            if(res&&res.data&&res.data.data&&angular.isArray(res.data.data)){
                $rootScope.effeToken = 2;
            }
        })
    }
    this.checkAuth = function(){
        return $rootScope.effeToken==2&&localStorage.$LIB_LOGINED==2;
    }
    this.checkAuthBackEnd = function(){
        return localStorage.$LIB_LOGINED==2;
    }
    this.loginAction = function(type){
        if ($uibModalStack) {
            $uibModalStack.dismissAll();
        }
        this.instan = modalCom.init('/public/tmpl/login.html', 'loginCtrl',{
            logintype: function() {
                return type||"none";
            }
        })
    };
    this.getUseName = function(){
        return localStorage.userName;
    };
    this.getRoldId = function(){
        return localStorage.roleId||false;
    };
    this.changePassword = function(){
        modalCom.init('/public/tmpl/password.html', 'passwordCtrl')
    }
}])


export default checkLoginModule.name;