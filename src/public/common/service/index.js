//import comModule from "./component";
import globalSettingModule from "./globalSetting";
import detailModule from "./detailSrv";
import checkLoginModule from "./checkLogin";
import pageFunModule from "./pageFun";
let ComServiceModule = angular.module("ComServiceModule",[
    //comModule,
    detailModule,
    globalSettingModule,
    checkLoginModule,
    pageFunModule
]);
export default ComServiceModule.name;