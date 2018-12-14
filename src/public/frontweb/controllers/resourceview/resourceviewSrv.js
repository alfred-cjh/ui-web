let resViewSrvModule = angular.module("resViewSrvModule", []);
resViewSrvModule.service("resViewSrv", ["$http", function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getResource: function (id) {
            return $http({
                method: "GET",
                url: `${static_url}resource/overview`,
            });
        }
    };
}]);