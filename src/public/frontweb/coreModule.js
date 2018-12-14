import codeModule from "./controllers/codemodule";
import componentModule from "./controllers/component";


let coreModule = angular.module("coreModule",[
    codeModule,
    componentModule
]);
export default coreModule.name;