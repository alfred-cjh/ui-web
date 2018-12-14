let scintroService = angular.module("scintroService", []);
scintroService.service("scintroSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "front/getschoolInfo"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "curriculumChapter",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "updateSchool",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `curriculumChapter/${params}`
            });
        }
    };
}]);
