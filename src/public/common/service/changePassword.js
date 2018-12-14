function changePassword($scope, $http, $location, $uibModalInstance,checkLogin) {
    var self = $scope;
    self.submitValid = false;
    self.passwordSubmitValid = false;
    self.passwordDisabled = false;
    self.showOldPasswd = localStorage.rolename=='admin'?false:true;
    self.passwordFormData = {
        oldPassword: "",
        newPassword: "",
        comfirmPassword: ""
    };


    self.modifyPassword = function(passwordForm) {
        if (passwordForm.$valid) {
            self.passwordDisabled = true;
            
            var url,option;
            if(localStorage.rolename=='admin'){
                url = "ailab-manager/v1/user/"+localStorage.userId
                option = {
                    passwd: self.passwordFormData.newPassword
                }
            }else{
                url = "ailab-manager/v1/user/modifypasswd"
                option = {
                    oldpasswd: self.passwordFormData.oldPassword,
                    newpasswd: self.passwordFormData.newPassword
                }
            }
            $http({
                method: "PUT",
                url: url,
                data: option
            }).then(function(result) {
                if (result && result.code == "0") {
                    $uibModalInstance.close();
                    checkLogin.loginAction();
                }
            }).finally(function() {
                self.passwordDisabled = false;
            });
        } else {
            self.passwordSubmitValid = true;
        }
    };
}
changePassword.$inject = ["$scope", "$http", "$location", "$uibModalInstance","checkLogin"]

export default changePassword;