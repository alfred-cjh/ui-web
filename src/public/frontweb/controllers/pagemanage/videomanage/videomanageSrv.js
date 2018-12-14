let videomanageService = angular.module("videomanageService", []);
videomanageService.service("videomanageSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {

        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "video"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "video",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + `video`,
                data: data
            });
        },
        delItem: function (id) {
            return $http({
                method: "delete",
                url: static_url + `video/${id}`,
            });
        },
    };
}]);
