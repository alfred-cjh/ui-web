import tagsModule from "./tags";
import disciplineModule from "./discipline/discipline";
import pathlistModule from "./pathlist/pathlist";
import pathstageModule from "./pathstage/pathstage";
import courselistModule from "./courselist/courselist";
import chaptersModule from "./chapters/chapters";
let coursemanageModule = angular.module("coursemanageModule", [
    tagsModule,
    disciplineModule,
    pathlistModule,
    pathstageModule,
    chaptersModule,
    courselistModule
]);


export default coursemanageModule.name;