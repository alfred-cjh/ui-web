"use strict";
export default function routeConfig($routeProvider,$locationProvider){
    $locationProvider.html5Mode(false);
    $routeProvider
        .when("/code/codespec", {
            templateUrl: "/public/frontweb/controllers/codemodule/codespec/tmpl/index.html",
            controller: "codespecCtrl",
            active:"codespec",
            parent: "code",
            reloadOnSearch:false
        })
        .when("/code/codedev", {
            templateUrl: "/public/frontweb/controllers/codemodule/codedev/tmpl/index.html",
            controller: "codedevCtrl",
            active:"codedev",
            parent: "code",
            reloadOnSearch:false
        })
        .when("/component/pagination", {
            templateUrl: "/public/frontweb/controllers/component/pagination/tmpl/index.html",
            controller: "paginationCtrl",
            active:"pagination",
            parent: "component",
            reloadOnSearch:false
        })
        
        //.otherwise({ redirectTo: "/resource/resourceview"});
        .otherwise({ redirectTo: "/code/codedev"});
};
routeConfig.$inject = ["$routeProvider","$locationProvider"];