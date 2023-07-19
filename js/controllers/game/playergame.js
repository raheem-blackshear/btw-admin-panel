beyondTheWalls.controller("playergameListCtrl", [
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
        $uibModal
    ) {
        $scope.gameId = localStorage.getItem("userId");
        $scope.userid = localStorage.getItem("userId");

        if (!localStorage.getItem("userId")) {
            $scope.gameId = $cookies.get("userId");
            console.log($scope.gameId, "$scope.gameId");
            $scope.userid = $cookies.get("userId");
        }

        /* Initialize list options */
        $scope.listOptions = {
            pageNo: 1,
            limit: 5,
            total: null,
            maxSize: 5
        };
        $scope.search = "";

        /* function to generate table with pagination */
        $scope.listGameFunc = function() {
            if ($scope.listOptions.pageNo == 1) {
                $scope.listOptions.skip = 0 * $scope.listOptions.limit;
            } else {
                $scope.listOptions.skip =
                    ($scope.listOptions.pageNo - 1) * $scope.listOptions.limit;
            }
            $loading.start();
            services.viewgame($scope.gameId, function(response, status) {
                if (status == 1) {
                    console.log(response.data);
                    $scope.gameList = response.data;
                    $loading.finish();
                } else {
                    factories.error(response.message);
                    factories.unAuthorize(response);
                    $loading.finish();
                }
            });
        };
        $scope.listGameFunc();

        $scope.exportCSV = function(id) {
            // var headers = { headers: {'Authorization': 'bearer '+ $cookies.get('token')}};

            services.csvGame(function(response, status) {
                if (status == 1) {
                    var blob = new Blob([document.getElementById(id).innerHTML], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });
                    saveAs(blob, id + "Report.xls");
                } else {
                    factories.error(response.message);
                    factories.unAuthorize(response);
                    $loading.finish();
                }
            });
        };

        /* function to call after page change */
        $scope.pageChanged = function() {
            $scope.listGameFunc();
        };

        /* function to show table info */
        $scope.tableInfo = function() {
            $scope.pg_options = {
                start: "",
                end: ""
            };
            if ($scope.listOptions.currentPage == 0) {
                $scope.pg_options.start = 1;
                $scope.pg_options.end = $scope.listOptions.limit;
            } else {
                $scope.pg_options.start = $scope.listOptions.skip + 1;
                $scope.pg_options.end =
                    $scope.listOptions.skip + $scope.gameList.length;
            }
        };

        $scope.viewUsers = function(data) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "viewUsersCompleted.html",
                controller: "viewUsersCtrl",
                size: "",
                resolve: {
                    items: function() {
                        return { details: data };
                    }
                }
            });
        };

        $scope.viewChallengename = function(data, details) {
            console.log(data, "data");
            $scope.gameID = data.gameId._id;

            console.log($scope.gameID, "$scope.gameID");
            localStorage.setItem("NgameId", $scope.gameID);
            $scope.challengeDetail = details;

            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "challenge-template.html",
                controller: "challengeCtrl",
                size: "",
                resolve: {
                    items: function() {
                        return {
                            details: details
                        };
                    }
                }
            });
        };

        $scope.removeGame = function(id) {
            factories.confirm("Do you want to remove this game ?", function(flag) {
                if (flag) {
                    services.removeGame(id, function(response, status) {
                        if (status == 1) {
                            factories.successCallback(response.message, function() {
                                $scope.listGameFunc();
                            });
                        } else {
                            factories.error(response.message);
                            factories.unAuthorize(response);
                        }
                    });
                }
            });
        };

        $scope.setFeatured = function(id, value, index) {
            var block;
            switch (value) {
                case true:
                    block = "add this game to featured";
                    break;
                case false:
                    block = "remove this game from featured";
                    break;
            }
            var message = "Do you want to " + block + "?";
            factories.confirm(message, function(flag) {
                if (flag) {
                    services.setFeaturedGame(id, !value, function(response, status) {
                        if (status == 1) {
                            factories.successCallback(response.message, function() {
                                $scope.listGameFunc();
                            });
                        } else {
                            factories.error(response.message);
                            factories.unAuthorize(response);
                        }
                    });
                } else {
                    $scope.gameList[index].is_featured = !value;
                }
            });
        };
        $scope.editPoints = function(cIds) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "edit-points.html",
                controller: "challengeCtrl",
                size: "",
                resolve: {
                    items: function() {
                        return {
                            details: cIds
                        };
                    }
                }
            });
        };

        $scope.editGame = function(data) {
            localStorage.setItem("gameData", JSON.stringify(data));
            $state.go("game.edit");
        };

        $scope.cloneGame = function(data) {
            localStorage.setItem("gameData", JSON.stringify(data));
            localStorage.setItem("clone", true);
            $state.go("game.createGame");
        };

        $scope.openLightboxModal = function(index) {
            Lightbox.openModal($scope.images, index);
        };
    }
]);

beyondTheWalls.controller("viewUsersCtrl", function(
    $uibModalInstance,
    $scope,
    items,
    services,
    $loading
) {
    $scope.gameID = items.details.gameId._id;
    services.viewusers($scope.gameID, function(response, status) {
        if (status == 1) {
            $scope.users = response.data;
            console.log("response");
        } else {
            factories.error(response.message);
            factories.unAuthorize(response);
            $loading.finish();
        }
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    };
});

beyondTheWalls.controller("challengeCtrl", function(
    $uibModalInstance,
    $scope,
    items,
    services,
    $loading,
    factories,
    $cookies,
    $state
) {
    console.log("opopopop");
    $scope.challenges = items.details;
    console.log($scope.challenges);
    $scope.gameID = localStorage.getItem("NgameId");

    $scope.playerId = localStorage.getItem("userId");
    console.log($scope.playerId, "$scope.playerId");

    if (!localStorage.getItem("userId")) {
        $scope.playerId = $cookies.get("userId");
        console.log($scope.playerId, "$scope.playerId -->> cookies");
    }


    /* Initialize list options */
    $scope.listOptions = {
        pageNo: 1,
        limit: 5,
        total: null,
        maxSize: 5
    };
    $scope.search = "";

    $loading.start();
    /* function to generate table with pagination */
    $scope.listGameFunc = function() {
        $loading.start();
        if ($scope.listOptions.pageNo == 1) {
            $scope.listOptions.skip = 0 * $scope.listOptions.limit;
        } else {
            $scope.listOptions.skip =
                ($scope.listOptions.pageNo - 1) * $scope.listOptions.limit;
        }
        services.viewgame($scope.playerId, function(response, status) {
            if (status == 1) {
                console.log(response);
                $scope.gameList = response.data;
                $loading.finish();
            } else {
                factories.error(response.message);
                factories.unAuthorize(response);
                $loading.finish();
            }
        });
    };

    services.gamepoints($scope.gameID, $scope.challenges, $scope.playerId, function(
        response,
        status
    ) {
        if (status == 1) {
            $scope.challenges = response.data.challenges;
        } else {
            factories.error(response.message);
            factories.unAuthorize(response);
            $loading.finish();
        }
    });

    if ($scope.challenges.length > 0) {
        $scope.gameID = $scope.challenges[0].gameId;
    }
    console.log($scope.playerId, "$scope.playerId");

    $scope.totalSum = 0;

    $scope.setChallenge = function(data) {
        console.log(data);
        // $loading.start();
        $scope.fromChallengeId = data._id;

        services.setDependency(
            $scope.fromChallengeId,
            $scope.toChallengeId,
            $scope.toChallengeName,
            function(response, status) {
                if (status == 1) {
                    factories.successCallback("Dependency Set", function() {
                        $uibModalInstance.dismiss("cancel");
                        $state.reload();
                        // $loading.finish();
                    });
                } else {
                    factories.error(response.message);
                    factories.unAuthorize(response);
                    // $loading.finish();
                }
            }
        );
    };

    $scope.uncomplete = function() {
        services.uncompchallenge($scope, $scope.playerId, function(
            response,
            status
        ) {
            if (status == 1) {
                $loading.finish();
                console.log(response);
                $scope.unapchallenge = response.data;
            } else {
                $loading.finish();
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };
    $scope.uncomplete();

    $scope.selectUnapChallenge = function(data) {
        console.log(data);

        services.uncompchallenge($scope, $scope.playerId, function(
            response,
            status
        ) {
            if (status == 1) {
                $loading.finish();
                console.log(response);
                $scope.unapchallenge = response.data;
            } else {
                $loading.finish();
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };

    $scope.saveUnapChallenge = function(chalId, point) {
        console.log(chalId);
        console.log(point);

        services.saveunapchallenge(
            chalId,
            point,
            $scope.gameID,
            $scope.playerId,
            function(response, status) {
                if (status == 1) {
                    $loading.finish();
                    factories.successCallback("Challenge created", function() {
                        console.log(response, "response");
                        $uibModalInstance.dismiss("cancel");
                        $loading.finish();
                    });
                } else {
                    $loading.finish();
                    factories.error(response.message);
                    factories.unAuthorize(response);
                }
            }
        );
    };

    $scope.viewAnswer = function(data) {
        console.log(data);
        $scope.gameID = data.gameId;
        $scope.challengeID = data._id;
        $loading.start();

        services.viewans($scope, function(response, status) {
            if (status == 1) {
                $loading.finish();
                if (status) {
                    if (response.data.textAnswer) {
                        factories.successCallback(response.data.textAnswer, function() {
                            console.log(response, "response");
                            $loading.finish();
                        });
                    } else {
                        factories.successCallback("No answer given", function() {
                            console.log(response, "response");
                            $loading.finish();
                        });
                    }
                } else {
                    // factories.successCallback("This challenge is only updated by admin");
                    factories.error(response.message);
                    return;
                }
            } else {
                $loading.finish();
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };

    $scope.selectChallenge = function(data) {
        console.log(data);
        if (data == "null") {
            console.log("if");
            // $scope.dependChallenge = 'null'
            $scope.toChallengeName = "";
        } else {
            console.log("else");
            $scope.dependChallenge = JSON.parse(data);
            if ($scope.dependChallenge) {
                $scope.toChallengeId = $scope.dependChallenge._id;
                $scope.toChallengeName = $scope.dependChallenge.name;
                console.log($scope.toChallengeId, $scope.toChallengeName);
            }
        }
    };

    angular.forEach($scope.challenges, function(value, key) {
        $scope.hintPoint = value.hints;
        // console.log($scope.hintPoint ,"$scope.hintPoint");
        $scope.totalSum = 0;
        angular.forEach($scope.hintPoint, function(value, key) {
            $scope.hpoints = value.points;
            $scope.totalSum += $scope.hpoints;
        });
        value.totalSum = value.points - $scope.totalSum;
        console.log(value.totalSum, "value.totalSum");
    });

    $scope.saveAnswer = function(data) {
        $loading.start();
        console.log("Here " + data.gameId);
        data.playerId = $scope.playerId;
        services.savepointService(data, function(response, status) {
            if (status == 1) {
                $loading.finish();
                factories.successCallback("success", function() {
                    $uibModalInstance.dismiss("cancel");
                });
            } else {
                $loading.finish();
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    };
});