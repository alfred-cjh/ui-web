"use strict";
export default function httpConfig($httpProvider){
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    };
    $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
    $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
    $httpProvider.interceptors.push([
        "$q", "$rootScope", "API_HOST","$location",
        function(q, $rootScope, api_host,$location) {
            return {
                request: function(config) {
                    if (config.url.indexOf("user-manager") > -1) {
                        var user_url = config.url.split("user-manager");
                        config.url = api_host.BASE + user_url[1];
                    }else if (config.url.indexOf("resource-manager") > -1) {
                        var resource_url = config.url.split("resource-manager");
                        config.url =api_host.RESOURCE + resource_url[1];
                    }else if (config.url.indexOf("ailab-manager") > -1) {
                        var ailab_url = config.url.split("ailab-manager");
                        config.url =api_host.AILAB + ailab_url[1];
                    }else if (config.url.indexOf("ailab-md") > -1) {
                        var ailab_url = config.url.split("ailab-md");
                        config.url =api_host.AILABIMG+ailab_url[1];
                    }
                    var auth_token = localStorage.$LIB_AUTH_TOKEN;
                    config.headers["X-Auth-Token"] = auth_token;
                    return config;
                },
                response: function(res) {
                    if (/\.html/.test(res.config.url)) {
                        return res;
                    }
                    // if (res.data.code == "01030700") {
                    //     if(!$rootScope.cacheModule){
                    //      $rootScope.cacheModule = $rootScope.checkLogin.loginAction('backend');
                    //     }
                    //     return res.data;
                    // }
                    if(res.config.url.indexOf("verifycode")>-1){
                        return res;
                    }
                    if (res.data.code == -1 || res.data.code == 500) {
                        if (/user-manager\/v1\/login/.test(res.config.url)) {
                            $rootScope.$broadcast("loginerror", "servererror");
                            return res.data;
                        }
                    }
                    //登录失败错误处理--start
                    if (res.data.code == "01030701") {
                        $rootScope.$broadcast("loginerror", "loginFiled");
                        return res.data;
                    }
                    //用户名或密码错误
                    if (res.data.code == "01030731") {
                        $rootScope.$broadcast("loginerror", "userorpasswderror");
                        return res.data;
                    }
                    // 验证码失效
                    if (res.data.code == "01090301") {
                        $rootScope.$broadcast("loginerror", "codeInvalid");
                        return res.data;
                    }
                    // 验证码错误
                    if (res.data.code == "01090302") {
                        $rootScope.$broadcast("loginerror", "codeError");
                        return res.data;
                    }
                    //登录失败错误处理--end
                    if (res.config.method.toUpperCase() != "GET" && 
                        res.config.url.indexOf("v1/login") == -1 && 
                        res.config.url.indexOf("v1/logout") == -1 && 
                        res.config.url.indexOf("v1/elasticsearch") == -1 && 
                        res.config.url.indexOf("v1/round") == -1) {
                        if (res.data.code == "0") {
                            $rootScope.$broadcast("ui-tag-bubble",{type:"success",code:res.data.code});
                        } else {
                            $rootScope.$broadcast("ui-tag-bubble",{type:"error",code:res.data.code});
                        }
                    }
                    if (res.config.method.toUpperCase() == "GET" &&
                        res.config.url.indexOf(".md") == -1) {
                        if (res.data.code != "0") {
                            $rootScope.$broadcast("ui-tag-bubble",{type:"error",code:res.data.code});
                        }
                    }
                    return res.data;
                },
                requestErr: function(rej) {
                    return rej;
                },
                responseErr: function(rej) {
                    return rej;
                }
            };
        }
    ]);
}
httpConfig.$inject = ["$httpProvider"];