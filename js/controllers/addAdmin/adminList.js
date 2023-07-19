beyondTheWalls.controller('adminListCtrl', ['$scope','$rootScope','$cookies','services','factories','$state','$stateParams','$loading','$timeout','Lightbox','$uibModal',
    function ($scope,$rootScope,$cookies,services,factories,$state,$stateParams,$loading,$timeout,Lightbox,$uibModal) {

    /* Initialize list options */
    $scope.listOptions = {
        pageNo:1,
        limit:5,
        total:null,
        maxSize:5
    };
    $scope.search = '';


    /* function to generate table with pagination */
    $scope.listGameFunc = function () {
        if($scope.listOptions.pageNo == 1){
            $scope.listOptions.skip = 0*$scope.listOptions.limit;
        }
        else{
            $scope.listOptions.skip = ($scope.listOptions.pageNo-1)*$scope.listOptions.limit;
        }
        $loading.start();
        services.listAdmin($scope.listOptions.skip,$scope.listOptions.limit,$scope.search,function (response,status) {
            if(status == 1){
                $scope.gameList = response.data.list;
                $scope.listOptions.total = response.data.totalCount;
                $scope.images = [];
                response.data.list.forEach(function (col) {
                    $scope.images.push({
                        url:col.gameImage ? col.gameImage.original:"img/no-image-available.jpg",
                        thumbUrl:col.gameImage ? col.gameImage.thumbnail:"img/no-image-available.jpg"
                    });
                });

                $scope.tableInfo();

                $loading.finish();
                // },1000);
            }
            else {
                factories.error(response.message);
                factories.unAuthorize(response);
                $loading.finish();
            }
        });
    };

    /* Call Function to paginate */
    $scope.listGameFunc();

    $scope.blockUnblockPlayer = function (id,sts,index) {
        var message = "Do you want to "+sts+" this admin ?";
        factories.confirm(message,function (flag) {
            if(flag){
                services.blockUnblockAdmin(id,sts,function (response,status) {
                    if(status == 1){
                        factories.successCallback(response.message,function () {
                            if(sts == 'Block'){
                                $scope.gameList[index].isBlocked = true;
                            }
                            else {
                                $scope.gameList[index].isBlocked = false;
                            }
                        });
                    }
                    else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
            }
        });
    };

    $scope.deleteAdmin = function (id) {
        var message = "Do you want to delete this admin ?";
        factories.confirm(message,function (flag) {
            if(flag){
                services.deleteuser(id,function (response,status) {
                    if(status == 1){
                        factories.successCallback(response.message,function () {
                            $scope.listGameFunc();
                        });
                    }
                    else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
            }
        });
    };
		
	$scope.editInfo = function (id) {
		$cookies.put('subAdminId', id);
		$state.go('parent.adminChangePassword');
    };


    $scope.exportCSV = function(id) {
        // var headers = { headers: {'Authorization': 'bearer '+ $cookies.get('token')}};

        services.csvPlayer(function (response, status) {
            if (status == 1) {
                var blob = new Blob([document.getElementById(id).innerHTML], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                saveAs(blob, id + "Report.csv");
            }
            else {
                factories.error(response.message);
                factories.unAuthorize(response);
                $loading.finish();
            }
        });
    };

    /* function to call after page change */
    $scope.pageChanged = function () {
        $scope.listGameFunc();
    };

    /* function to show table info */
    $scope.tableInfo = function () {
        $scope.pg_options = {
            start:'',
            end:''
        };
        if($scope.listOptions.currentPage == 0){
            $scope.pg_options.start = 1;
            $scope.pg_options.end = $scope.listOptions.limit;
        }
        else {
            $scope.pg_options.start = $scope.listOptions.skip+1;
            $scope.pg_options.end = $scope.listOptions.skip+$scope.gameList.length;
        }
    };

    $scope.viewChallenge = function (details) {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'challenge-template.html',
            controller: 'challengeCtrl',
            size: '',
            resolve: {
                items: function () {
                    return {
                        details:details
                    };
                }
            }
        });
    };

    $scope.removeGame = function (id) {
        factories.confirm("Do you want to remove this game ?",function (flag) {
            if(flag){
                services.removeGame(id,function (response,status) {
                    if(status == 1){
                        factories.successCallback(response.message,function () {
                            $scope.listGameFunc();
                        });
                    }
                    else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
            }
        });
    };

    $scope.setFeatured = function (id,value,index) {
        var block;
        switch (value){
            case true:
                block = 'add this game to featured';
                break;
            case false:
                block = 'remove this game from featured';
                break;
        }
        var message = "Do you want to "+block+"?";
        factories.confirm(message,function (flag) {
            if(flag){
                services.setFeaturedGame(id,value,function (response,status) {
                    if(status == 1){
                        factories.successCallback(response.message,function () {
                            $scope.listGameFunc();
                        });
                    }
                    else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
            }
            else {
                $scope.gameList[index].is_featured = !value;
            }
        });
    };

    $scope.editGame = function (data) {
        localStorage.setItem('gameData',JSON.stringify(data));
        $state.go('game.edit');
    };

    $scope.cloneGame = function (data) {
        localStorage.setItem('gameData',JSON.stringify(data));
        localStorage.setItem('clone',true);
        $state.go('game.createGame');
    };

    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
    };

}]);



beyondTheWalls.controller('adminPasswordCtrl', ['$scope','$rootScope','$cookies','services','factories','$state','$stateParams','$loading','$timeout','Lightbox','$uibModal',
    function ($scope,$rootScope,$cookies,services,factories,$state,$stateParams,$loading,$timeout,Lightbox,$uibModal) {
			
	$scope.changePwd = function (isValid) {
        if(isValid && $scope.admin.new == $scope.admin.confirm){
            var param_data = {};
            param_data.password = $scope.admin.new;
			param_data.subAdminId = $cookies.get('subAdminId'); 

            $loading.start();
            services.changepasswordAdmin(param_data, function (response,status) {
                if(status == 1){
                    $loading.finish();
                    factories.successCallback(response.message,function () {
                         $state.go('parent.adminList');
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