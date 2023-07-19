beyondTheWalls.controller('ForgotPasswordCtrl', ['$scope','$cookies','services','factories','$state','$loading',function ($scope,$cookies,services,factories,$state,$loading) {

    $scope.user = {
        oldPassword:'',
        newPassword:''
    };

    $scope.forgot = function (isValid) {
        if(isValid){
            $loading.start();
            services.forgot($scope.user.oldPassword,$state.params.token,function (response,status) {
                if(status == 1){
                    $loading.finish();
                    factories.successCallback(response.message,function () {
                        $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                    });
                }
                else {
                    $loading.finish();
                    factories.error(response.message);
                }
            });
        }
    };

}]);