let libintroService = angular.module("libintroService", []);
libintroService.service("libintroSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "front/getExperimentInfo"
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "updateExperiment",
                data:data
            });
        }
    };
}]);
