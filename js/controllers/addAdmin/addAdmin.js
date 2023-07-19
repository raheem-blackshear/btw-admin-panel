beyondTheWalls.controller('addadminCtrl', ['$scope','$rootScope','$cookies','services','factories','$state','$stateParams','$loading','$timeout',
    function ($scope,$rootScope,$cookies,services,factories,$state,$stateParams,$loading,$timeout) {
        $scope.addAdmin = function (isValid) {
            if(isValid){
                var param_data = {};
                param_data.name = $scope.settings.name;
                param_data.email = $scope.settings.email;
                param_data.password = $scope.settings.password;
                $loading.start();
                services.addadmin(param_data, $scope, function (response,status) {
                    if(status == 1){
                        $loading.finish();
                        $state.go('parent.adminList',{},{reload:true});
                        factories.success("Admin created successfully");
                    }
                    else {
                        $loading.finish();
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
            }
        }

}]);