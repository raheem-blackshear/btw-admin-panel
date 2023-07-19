beyondTheWalls.controller("liveGamesCtrl", [
    "$scope",
    "$rootScope",
    "$cookies",
    "services",
    "factories",
    "$state",
    "$stateParams",
    "$loading",
    "$timeout",
    "Lightbox",
    "$uibModal",
    "$timeout",
    function(
        $scope,
        $rootScope,
        $cookies,
        services,
        factories,
        $state,
        $stateParams,
        $loading,
        $timeout,
        Lightbox,
        $uibModal,
        $timeout
    ) {
        
        $scope.completeGame = function(data) {
            console.log("checking", data);

            var obj = {
                accessToken: $cookies.get("token"),
                challengeId: data.challengeId._id,
                points: data.challengeId.points,
                gameId: data.gameId,
                userId: data.userId._id
            };

            services.completeGameService(obj, function(response, status) {
                if (status == 1) {
                    $loading.finish();
                    factories.successCallback(response.message, function() {
                        $uibModalInstance.dismiss("cancel");
                    });
                } else {
                    $loading.finish();
                    factories.error(response.message);
                    factories.unAuthorize(response);
                }
            });
        };

        $scope.start = false;
        $loading.start();
        $scope.getList = function(status) {
            services.liveGamesService(function(response, status) {
                if (status == 1) {
                    services.datatable("tableId", {});

                    $scope.allData = response.data;
                    // if ($.fn.DataTable.isDataTable('#tableId')) {angular.element('#tableId').DataTable().clear().destroy();}
                    // services.datatable('tableId',{});
                    $scope.start = true;
                    $loading.finish();
                } else {
                    $scope.start = true;
                    factories.error(response.message);
                    factories.unAuthorize(response);
                    $loading.finish();
                }
            });
        };
        $scope.getList(false);

        $scope.setFeatured = function(id, value, index) {
            var block;
            switch (value) {
                case true:
                    block = "mark this feed featured";
                    break;
                case false:
                    block = "unmark this feed from featured";
                    break;
            }
            var message = "Do you want to " + block + "?";
            factories.confirm(message, function(flag) {
                if (flag) {
                    services.featuredToggle(id, value, function(response, status) {
                        $loading.start();
                        if (status == 1) {
                            $loading.finish();
                            factories.successCallback(response.message, function() {
                                $scope.feedList[index].is_featured = value;
                            });
                        } else {
                            factories.error(response.message);
                            factories.unAuthorize(response);
                            $loading.finish();
                        }
                    });
                } else {
                    $scope.feedList[index].is_featured = !value;
                }
            });
        };

        $scope.removePlayer = function(id, type) {
            factories.confirm("Do you want to remove this feed ?", function(flag) {
                if (flag) {
                    services.setFeaturedOrDelete(id, type, function(response, status) {
                        $loading.start();
                        if (status == 1) {
                            $loading.finish();
                            factories.successCallback(response.message, function() {
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            });
                        } else {
                            factories.error(response.message);
                            factories.unAuthorize(response);
                            $loading.finish();
                        }
                    });
                }
            });
        };

        $scope.openLightboxModal = function(index) {
            Lightbox.openModal($scope.images, index);
        };

        $scope.showFeed = function(data) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "feeds-template.html",
                controller: "showFeedCtrl",
                size: "",
                resolve: {
                    items: function() {
                        return {
                            details: data
                        };
                    }
                }
            });
        };
    }
]);

beyondTheWalls.controller("showFeedCtrl", function(
    $uibModalInstance,
    $scope,
    items
) {
    $scope.video = items.details;
    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    };
});