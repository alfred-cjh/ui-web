let noticeService = angular.module("noticeService", []);
noticeService.service("noticeSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: static_url + "getAnnounceInfo"
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: static_url + "addAnnounceInfo",
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: static_url + "updateAnnounce",
                data:data
            });
        },
        getDetail:function(id){
            return $http({
                method: "GET",
                url: static_url + `announceInfo/${id}`
            });
        },
        delItem: function (params) {
            return $http({
                method: "delete",
                url: static_url + `deleteAnnounce/${params}`
            });
        }
    };
}]);
