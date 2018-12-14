function loginFun(scope,$rootScope,$http,$uibModalInstance,$route,logintype,globalMenuModule,$location){
    var self = scope;
        localStorage.clear();
        sessionStorage.clear();
        $rootScope.effeToken = 1;
        self.submitted = false;
        self.loginCfmed = false; //控制错误信息提示以及4秒消失
        self.logining = false; //控制登陆转圈的显示
        self.submitted = false;
        self.loginError = 0;
        self.login = {
            username: "",
            password: "",
            verificationCode:"",
            verifyKey:""
        };
        self.$on("loginerror", function(e, type) {
            if (type == "loginFiled") {
                self.loginError = 1;
            } else if (type == "userorpasswderror") {
                self.loginError = 2;
            } else if (type == "codeError") {
                self.loginError = 3;
            }else if (type == "codeInvalid") {
                self.loginError = 4;
            }
            self.loginCfmed = true;
        });

        self.interacted = function(field) {
            return self.submitted || field.$dirty;
        };
        self.getVerificationCode = function(loginForm){
            getVerificationCode(self,$http)
            //self.loginForm.$setPristine();
            if(loginForm){
                loginForm.$setPristine();
                loginForm.$setUntouched();
            }
        };
        self.getVerificationCode();
        self.submitForm = function() {
            if (self.loginForm.$valid) {
                //self.loginCfmed = true;
                self.logining = true;
                self.loginError = "";
                var data = angular.copy(self.login);
                $http({
                    method: "POST",
                    url: "ailab-manager/v1/login",
                    data: data
                }).then(function(result) {
                    if (result && result.code == "0") {
                        loginInit($rootScope,result,$route,logintype,$location,globalMenuModule);
                        
                        $uibModalInstance.close();
                    }
                }).finally(function() {
                    self.logining = false;
                    // $timeout(function() {
                    //     self.loginCfmed = false;
                    // }, 4000);
                });
            } else {
                self.submitted = true;
            }
        };
        self.dismiss = function(){
            $rootScope.cacheModule = null;
            $uibModalInstance.close();
        }
        
}


//登录后初始化
function loginInit($rootScope,result,$route,logintype,$location,globalMenuModule) {
    $rootScope.effeToken = 2;//全局变量登录状态 2:已登录
    $rootScope.userName = result.data.data.userInfo.username;//页面右上角用户名展示
    self.loginError = 0;

    localStorage.$LIB_LOGINED = 2;//本地登录状态 2:已登录
    localStorage.$LIB_AUTH_TOKEN = result.data.data.token;//token
    localStorage.userId = result.data.data.userInfo.id;//用户id
    localStorage.userName = result.data.data.userInfo.username;//用户名
    localStorage.roleId = result.data.data.userInfo.roleid;//角色id 4:student 
    localStorage.rolename = result.data.data.userInfo.rolename;//角色id 4:student 
    localStorage.collegeid = result.data.data.userInfo.collegeid;//角色id 4:student 
    localStorage.collegeno = result.data.data.userInfo.collegeno;//角色id 4:student 
    localStorage.classid = result.data.data.userInfo.classid;
    if(logintype=="backend"){
        // if(localStorage.roleId==4){
        //     window.location.href = "/#/";
        // }else{
            if(globalMenuModule[localStorage.roleId+"_PERMIT"].indexOf($location.url())>-1){
                $route.reload();
            }else{
                $location.url(globalMenuModule[localStorage.roleId+"_PERMIT"][0])
            }
        //}
    }else if(logintype=="frontend"){
        if((localStorage.roleId==1||localStorage.roleId==2)&&(/^\/page\/labs/.test($location.path()))){
            $location.url('/page/welcome');
        }else{
            $route.reload();
        }
    }else{
        $route.reload();
    }
}

function getVerificationCode(self,$http){
        self.login.verificationCode = "";
        var url = "http://192.168.137.15:8080/ailab-manager/v1/verifycode";
        $http({
            url: url,
            method: 'GET',
            responseType: 'blob'
        }).then(function(res) {
            if (res && res.data) {
                let codeData = new FileReader();
                codeData.onload = function(){
                    self.imgUrl = this.result;
                    self.$apply();
                }
                codeData.readAsDataURL(res.data);
            }
            if (res && res.headers() && res.headers("x-verification-key")) {
                self.login.verifyKey = res.headers("x-verification-key");
            }
        });
}


loginFun.$inject = ["$scope","$rootScope","$http","$uibModalInstance","$route","logintype","globalMenuModule","$location"]

export default loginFun;