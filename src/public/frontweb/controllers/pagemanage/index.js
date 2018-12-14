import platformModule from "./platform/platform";
import carouselModule from "./carousel/carousel";
import scintroModule from "./scintro/scintro";
import libintroModule from "./libintro/libintro";
import noticeModule from "./notice/notice";
import datasmanageModule from './datasmanage/datasmanage';
import videomanageModule from './videomanage/videomanage';

let pagemanageModule = angular.module("pagemanageModule", [
    platformModule,
    carouselModule,
    scintroModule,
    libintroModule,
    noticeModule,
    datasmanageModule,
    videomanageModule
]);

export default pagemanageModule.name;