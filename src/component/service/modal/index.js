
modalCom.$inject = ["$uibModal"];
export function modalCom($uibModal){
    this.init = function(template,controller,resolve){
        var modalInstance = $uibModal.open({
            templateUrl:template,
            backdrop:"static",
            controller:controller,
            resolve:resolve?resolve:null,
        });
        return modalInstance;
    };
    return this;
}
