let carouselService = angular.module("carouselService", []);
carouselService.service("carouselSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "getPictureInfo"
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
                url: static_url + "curriculumChapter",
                data:data
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `deletePicture/${params}`
            });
        }
    };
}]);
