let datasmanageService = angular.module("datasmanageService", []);
datasmanageService.service("datasmanageSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {

        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "dataSetManage"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "dataSetManage",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + `dataSetManage`,
                data: data
            });
        },
        delItem: function (id) {
            return $http({
                method: "delete",
                url: static_url + `dataSetManage/${id}`,
            });
        }
    };
}]);
