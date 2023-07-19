beyondTheWalls.controller('settingCtrl', ['$scope','$rootScope','$cookies','services','factories','$state','$stateParams','$loading','$timeout',
    function ($scope,$rootScope,$cookies,services,factories,$state,$stateParams,$loading,$timeout) {

    $scope.changePwd = function (isValid) {
        if(isValid){

            var param_data = {};
            param_data.oldPassword = $scope.settings.old;
            param_data.newPassword = $scope.settings.new;

            $loading.start();
            services.changepassword(param_data, $scope, function (response,status) {
                if(status == 1){
                    $loading.finish();
                    factories.successCallback(response.message,function () {
                    });
                }
                else {
                    $loading.finish();
                    factories.error(response.message);
                    factories.unAuthorize(response);
                }
            });
        }
    };

}]);