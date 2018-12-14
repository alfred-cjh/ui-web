import loginFun from "../common/service/loginFun";
import changePassword from "../common/service/changePassword";
let mainModule = angular.module("main", [])
    .controller("MainCtrl", mainInit)
    .controller("loginCtrl", loginFun)
    .controller("passwordCtrl", changePassword);

function loginOut($http, $rootScope) {
    $http({
        url: "ailab-manager/v1/logout",
        method: "POST"
    }).then(function() {
        localStorage.clear();
        $rootScope.effeToken = 1;
        window.location.href = "/#/page/welcome";
    })
}

function mainInit($scope, $rootScope, $routeParams, $location, $http, translate, globalMenuModule, $uibModalStack, ngTableDefaults,checkLogin) {
    var self = $scope;
    $rootScope.checkLogin = checkLogin;
    function changeSiteTitle(path) {
        var titles = path.replace("/", "").split("/");
        var title = titles.length == 1 ? (titles[titles.length - 1] == "" ? "home" : titles[titles.length - 1]) : titles[1];
        var trans_title = translate.instant("cn.siteTitle." + title);
        $rootScope.pathTitle = trans_title;
    }
    self.logoLink = function(){
        var roleId = localStorage.roleId;
        if(roleId==4){
            window.location.href="/#/"
        }else{
            let url = globalMenuModule[`${roleId}_PERMIT`][0];
            $location.url(url);
        }
    }
    self.$on("$routeChangeSuccess", function(evt, current) {
        self.activeMenu(evt, current);
    });
    self.checkActive = function(item) {
        let fullpath = $location.path();
        let fullpathArr = fullpath.split("/");
        if (item.active) {
            return _.includes(item.active.split(","), fullpathArr[1]) || _.includes(item.active.split(","), fullpathArr[2]);
        }
    };

    $rootScope.sideMenu = {
        sideMenuList: [], //当前左侧菜单数据
        activeSubMenu: "", //当前左侧菜单打开的二级菜单的位置
        sideMentTitle: "", //当前左侧菜单标题
        subMenuTitle: "", //当前页面在右侧显示的标题
        menuKeyword: ""
    };
    $rootScope.sideMenu.sideMenuList = globalMenuModule.ADMIN_MENU;
    self.activeMenu = function(evt, current) {
        if (current && current.originalPath) {
            $rootScope.menuActive = current.originalPath.split("/")[2];
            $rootScope.subMenuActive = current.originalPath.split("/")[3];
            changeSiteTitle(current.originalPath);
        }
        if (current && current.active) {
            $rootScope.sideMenu.menuKeyword = current.active;
            $rootScope.sideMenu.activeSubMenu = current.parent;
        }
    };
    
    self.relogin = function() {
        $location.path("/");
        $rootScope.effeToken = false;
    }
    self.$watch(function() {
        return $rootScope.effeToken;
    }, function(val) {
        if (val) {
            //考虑到有弹出层的时候token失效。
            // if ($uibModalStack) {
            //     $uibModalStack.dismissAll();
            // }
        }
    });
    //配置全局搜索框的搜索函数
    self.defaultSettings = {
        filterOptions: {
            filterFn: ageRangeFilter
        }
    };
    ngTableDefaults.settings = angular.extend({}, ngTableDefaults.settings, self.defaultSettings);

    function ageRangeFilter(data, filterValues /*, comparator*/ ) {
        var filterValuesArr = [];
        for (var i in filterValues) {
            filterValuesArr.push(filterValues[i], i);
        }
        return data.filter(function(item) {
            if (item[filterValuesArr[1]] != undefined && (
                    item[filterValuesArr[1]] == filterValuesArr[0] ||
                    item[filterValuesArr[1]].toString().indexOf(filterValuesArr[0]) > -1)) {
                return true;
            } else {
                return false;
            }
        });
    }
    self.changPassword = function(){
        $rootScope.checkLogin.changePassword();
    }
    self.loginOut = function(){
        loginOut($http,$rootScope);
    }
    self.userLogin = $rootScope.checkLogin.loginAction;
    $rootScope.userName = $rootScope.checkLogin.getUseName();

}
mainInit.$inject = ["$scope", "$rootScope", "$routeParams", "$location", "$http", "$translate", "globalMenuModule", "$uibModalStack", "ngTableDefaults","checkLogin" ]

export default mainModule.name;
