import $http from "./http";
import qs from "qs";

// 查询资源组
export const getItemList = (params) => {
    return $http({
        url: `/ailab-manager/v1/users`,
        method: "get",
        params:params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    });
};

// 新建资源组
export const createItem = (data) => {
    return $http({
        url: `/ailab-manager/v1/users`,
        method: "post",
        data:data
    });
};
// 编辑资源组
export const editItem = (data) => {
    return $http({
        url: `/ailab-manager/v1/users`,
        method: "put",
        data:data
    });
};
// 删除资源组
export const delItem = (data) => {
    return $http({
        url: `/ailab-manager/v1/users`,
        method: "delete",
        data:data
    });
};


