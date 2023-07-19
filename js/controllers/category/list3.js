beyondTheWalls.controller('list3Ctrl', ['$scope', '$rootScope', '$cookies', 'services', 'factories', '$state', '$stateParams', '$loading', '$timeout', '$uibModal',
    function ($scope, $rootScope, $cookies, services, factories, $state, $stateParams, $loading, $timeout, $uibModal) {
        console.log('res')

        $rootScope.level = $stateParams.level;

        services.listlevelService(2,function (response, status) {
            if (status == 1) {
                // $scope.dataList = response.data;
                $scope.dataList = _.sortBy(response.data, [
                    function(o) {
                        return o.name;
                    }
                ]);
            }
        });

        $scope.getList = function(){
            var data = {};
            data.level = $rootScope.level;
            if($scope.levelTwo){
                data.id = $scope.levelTwo._id;
            }
            services.listlevelwithIdService(data,function (response, status) {
                $loading.start();
                if (status == 1) {
                    // $scope.allData = response.data;
                    // console.log($scope.allData);
                    $scope.allData =    _.sortBy(response.data, [function(o) { return o.name; }]);

                    services.datatable('tableId',{});
                    $loading.finish();
                }
                else {
                    factories.error(response.message);
                    factories.unAuthorize(response);
                    $loading.finish();
                }
            });
        }
        $scope.getList();

        $scope.deleteFun = function (data) {
            console.log('data', data);
            factories.confirmDelete('Are you sure, Do you want to delete level 3 ?',function () {
                var obj = {
                    id:data._id,
                    level:data.level
                }
                services.removeCategoryService(obj, function (response, status) {
                    if (status == 1) {
                        factories.successCallback(response.message, function () {
                            $state.transitionTo($state.current, $stateParams, {reload: true, inherit: false, notify: true});
                        });
                    }
                    else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                })
            });
        };

        $scope.addEditFun = function (data) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addEdit3.html',
                controller: 'addEditCtrl3',
                size: '',
                resolve: {
                    items: data
                }
            });
        };


    }]);

beyondTheWalls.controller('addEditCtrl3', function ($stateParams,$state,$uibModalInstance,$scope,items,services,$cookies,$rootScope,factories) {
    console.log('[][]]]][]',items)
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    if(items){
        $scope.id = items._id;
        $scope.name = items.name;
    }
    services.listlevelService(2, function(response, status) {
        if (status == 1) {
            $scope.dataList = response.data;
            // $scope.dataList = _.sortBy(response.data, [function(o) { return o.name; }]);
            if(items) {
                var findIndex  =_.findIndex($scope.dataList, {_id: items.levelTwo._id});
                $scope.levelTwo = response.data[findIndex];
            }
            else {
                $scope.levelTwo = response.data[0];
            }
        }
    });

    $scope.submit = function () {
        if($scope.name){
            $scope.cancel();
            var obj = {
                accessToken:$cookies.get('token'),
                name:$scope.name,
                level: $rootScope.level,
                levelTwo:$scope.levelTwo._id
            }
            if($scope.id){
                obj.id = $scope.id;
            }
            services.addCategoryService(obj,function (response,status) {
                if(status)
                {

                    factories.successCallback('Success',function () {
                        $state.transitionTo($state.current, $stateParams, {reload: true, inherit: false, notify: true});
                    });

                    console.log('res',response)
                }

            })
        }
        else {
            factories.error('Please enter name');
        }

    }

});
