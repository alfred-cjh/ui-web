import codedevModule from "./codedev";
import codespecModule from "./codespec";

let codeModule = angular.module("codeModule", [
    codedevModule,
    codespecModule
]);


export default codeModule.name;