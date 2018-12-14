import * as services from './service'
import * as directives from './directive'

let ComModule = angular.module("ComModules",["ngTable",
    "ui.bootstrap"
]);
ComModule.config(["$provide", function($provide){
    $provide.service(services);
}])
.config(["$compileProvider", function($provide){
    $provide.directive(directives);
}])
export default ComModule.name;