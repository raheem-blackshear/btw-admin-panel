beyondTheWalls.controller("gameListCtrl", [
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
        $scope.gameList = JSON.parse(localStorage.getItem("gamedata"));
        console.log($scope.gameList, "$scope.gameList");

        /* Initialize list options */
        $scope.listOptions = {
            pageNo: 1,
            limit: 10,
            total: null,
            maxSize: 10
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
            services.listGame(
                $scope.listOptions.skip,
                $scope.listOptions.limit,
                $scope.search,
                function(response, status) {
                    if (status == 1) {
                        localStorage.removeItem("gameData");
                        localStorage.removeItem("clone");
                        $scope.gameList = response.data.list;
                        console.log(response.data);
                        $scope.listOptions.total = response.data.totalCount;
                        $scope.images = [];
                        response.data.list.forEach(function(col) {
                            $scope.images.push({
                                url: col.gameImage ?
                                    col.gameImage.original : "img/no-image-available.jpg",
                                thumbUrl: col.gameImage ?
                                    col.gameImage.thumbnail : "img/no-image-available.jpg"
                            });
                        });

                        // services.datatable('gameTable',{});

                        // if ( $.fn.dataTable.isDataTable( '#gameTable' ) ) {
                        //     console.log("if -->>")
                        //     table = $('#gameTable').DataTable();
                        // }
                        // else {
                        //     console.log("else -->>")
                        //     table = $('#gameTable').DataTable( {
                        //         paging: false
                        //     } );
                        // }
                        table = $("#gameTable").DataTable();
                        table.destroy();

                        $scope.tableInfo();
                        $loading.finish();
                    } else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                        $loading.finish();
                    }
                }
            );
        };
        $scope.listGameFunc();

        $scope.allexcelItems = [];
        $scope.alsqldata = function() {
            alasql('SELECT * INTO XLSX("GamesList.xlsx",{headers:true}) FROM ?', [
                $scope.allexcelItems
            ]);
        };

        $scope.exportCSV = function(id) {
            // var headers = { headers: {'Authorization': 'bearer '+ $cookies.get('token')}};

            services.csvGame(function(response, status) {
                if (status == 1) {
                    console.log(response);
                    $scope.allexcelItems = response.data;
                    $scope.count = 1;
                    response.data.forEach(function(col) {
                        $scope.allexcelItems.push({
                            "S.No": $scope.count++,
                            "Sort Name": col.sortName,
                            Email: col.email,
                            Name: col.name,
                            "Facebook id": col.facebookId,
                            "Total Points": col.totalPoints,
                            "Twitter id": col.twitterId
                        });
                    });

                    $scope.alsqldata();
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

        $scope.viewChallenge = function(details) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "challenge-template.html",
                controller: "challengeCtrl",
                size: "lg",
                resolve: {
                    items: function() {
                        $scope.listGameFunc();
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
                    services.setFeaturedGame(id, value, function(response, status) {
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

        $scope.editGame = function(data) {
            localStorage.setItem("gameData", JSON.stringify(data));
            // localStorage.removeItem("clone");
            $state.go("game.createGame", {}, { reload: true });
        };

        $scope.cloneGame = function(data) {
            localStorage.setItem("gameData", JSON.stringify(data));
            localStorage.setItem("clone", true);
            $state.go("game.createGame", {}, { reload: true });
        };

        $scope.openLightboxModal = function(index) {
            Lightbox.openModal($scope.images, index);
        };

        $scope.arrangebtn = function(data) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "challengeSwap.html",
                controller: "challengeSwapCtrl",
                resolve: {
                    items: function() {
                        return {
                            data: data
                        };
                    }
                }
            });
        };

        $scope.timerStart = function(data) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "timerStart.html",
                controller: "timerStartCtrl",
                resolve: {
                    items: function() {
                        return {
                            data: data
                        };
                    }
                }
            });
        };
    }
]);

beyondTheWalls.controller("challengeCtrl", function(
    $uibModalInstance,
    $scope,
    items,
    services,
    factories,
    $state,
    $cookies
) {
    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    };
    $scope.challenges = items.details;
    $scope.totalSum = 0;

    $scope.removeChallenge = function(id) {
        factories.confirm("Do you want to remove this challenge ?", function(flag) {
            if (flag) {
                services.removechallenge(id, function(response, status) {
                    if (status == 1) {
                        factories.successCallback(response.message, function() {
                            $uibModalInstance.dismiss("cancel");
                            $state.reload();
                        });
                    } else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
            }
        });
    };

    $scope.selectChallenge = function(data) {
        $scope.sendArr = [];
        if (data == "null") {
            console.log("if");
            // $scope.dependChallenge = 'null'
            $scope.toChallengeName = "";
        } else {
            angular.forEach(data, function(val, key) {
                $scope.sendArr.push({
                    dependUponChallengeName: val.name,
                    dependUpon: val._id
                });
            });
        }
    };

    $scope.setChallenge = function(data) {
        $scope.fromChallengeId = data._id;
        console.log("$scope.sendArr", $scope.sendArr);
        var obj = {
            accessToken: $cookies.get("token"),
            whichChallengeId: data._id,
            depended: $scope.sendArr
        };

        services.setDependencyService(obj, function(response, status) {
            if (status == 1) {
                $scope.cancel();
                $state.go($state.current, {}, { reload: true });
                factories.success("Dependency Set");
            } else {
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };

    $scope.unsetChallenge = function(id) {
        // $scope.fromChallengeId = id;
        // console.log('$scope.sendArr',$scope.sendArr)
        var obj = {
            // "accessToken": $cookies.get('token'),
            id: id
                // "depended": $scope.sendArr,
        };

        services.unsetDependencyService(obj, function(response, status) {
            if (status == 1) {
                $scope.cancel();
                $state.go($state.current, {}, { reload: true });
                factories.success("Success");
            } else {
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
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
    });
});

beyondTheWalls.controller("challengeSwapCtrl", function(
    $uibModalInstance,
    $scope,
    items,
    services,
    factories,
    $state
) {
    $scope.challenges = items.data;
    $scope.objID = [];
    var tmpList = [];
    $scope.list = [];

    angular.forEach($scope.challenges, function(value, key) {
        $scope.objID.push(value.orderId);
        tmpList.push({
            text: "Item " + key,
            value: value.orderId,
            name: value.name,
            _id: value._id
        });
        // console.log("tmpList", tmpList);
        // console.log($scope.objID ,"$scope.objID")
    });

    // $scope.sortingLog = [];
    // for (var i = 1; i <= $scope.challenges.length; i++){
    // }
    $scope.list = angular.copy(tmpList);
    //    console.log($scope.list ,"$scope.list");

    $scope.sortableOptions = {
        // called after a node is dropped
        update: function(e, ui) {
            console.log("update");
            $scope.sortingLog = [];
            var logEntry = $scope.list
                .map(function(i) {
                    //                console.log(logEntry ,"update");
                    return i._id;
                })
                .join(", ");
            $scope.sortingLog.push("Update: " + logEntry);
            // console.log($scope.sortingLog, "$scope.sortingLog -->> update")
        },

        stop: function(e, ui) {
            $scope.sortingLog = [];
            // this callback has the changed model
            var logEntry = $scope.list.map(function(i) {
                return i._id;
            });
            $scope.sortingLog.push(logEntry);

            for (var i = 0; i < $scope.objID.length; i++) {
                if ($scope.objID[i] == $scope.sortingLog[i]) {
                    console.log("array match");
                } else {
                    // console.log($scope.objID[i], "$scope.objID[i]--");
                    // console.log($scope.sortingLog, "$scope.sortingLog--");

                    var from = $scope.objID[$scope.objID.indexOf($scope.objID[i])];
                    var to = $scope.objID[$scope.sortingLog[0].indexOf($scope.objID[i])];

                    // console.log($scope.sortingLog, "$scope.sortingLog",$scope.objID);

                    console.log(tmpList, "$scope.sortingLog[0]", $scope.sortingLog[0]);
                    $scope.myNewArr = [];
                    angular.forEach($scope.sortingLog[0], function(val, key) {
                        $scope.myNewArr.push({
                            id: val,
                            new: key
                        });
                    });

                    console.log("final", $scope.myNewArr);

                    return to;
                }
            }
        }

        // stop: function(e, ui) {
        //     var logEntry = {
        //         // ID: $scope.sortingLog.length + 1,
        //         Text: 'Moved element: ' + ui.item.scope().item.name
        //     };
        //     $scope.sortingLog.push(logEntry);
        //     console.log($scope.sortingLog ,"$scope.sortingLog");
        // }
    };

    $scope.finalSubmit = function() {
        console.log("$scope.", $scope.myNewArr);
        if (!$scope.myNewArr) {
            factories.error("Please change the order");
            return;
        }

        services.swapOrder($scope.objID, $scope.myNewArr, function(
            response,
            status
        ) {
            if (status == 1) {
                // $state.reload();

                factories.successCallback(response.message, function() {
                    $uibModalInstance.dismiss("cancel");
                    $state.go($state.current, {}, { reload: true });
                    //
                });
            } else {
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    };
});

beyondTheWalls.controller("timerStartCtrl", function(
    $uibModalInstance,
    $scope,
    items,
    services,
    factories,
    $state,
    $stateParams
) {
    $scope.challenges = items.data.challenges;
    $scope.list = [];
    if (items.data.delayTimer) {
        $scope.list.push({
            name: "None",
            _id: null,
            checked: false
        });
    } else {
        $scope.list.push({
            name: "None",
            _id: null,
            checked: true
        });
    }

    angular.forEach(items.data.challenges, function(val, key) {
        var obj1 = {};
        if (items.data.delayTimer == val._id) {
            obj1 = {
                name: val.name,
                _id: val._id,
                checked: true
            };
        } else {
            obj1 = {
                name: val.name,
                _id: val._id,
                checked: false
            };
        }

        $scope.list.push(obj1);
    });

    $scope.changeVal = function(data) {
        console.log("[dada", data);
        $scope.SelectedVal = data;
    };

    $scope.submit = function() {
        $scope.cancel();
        var obj = {};
        obj.gameId = items.data._id;
        if ($scope.SelectedVal) {
            obj.id = $scope.SelectedVal;
            obj.reset = false;
        } else {
            obj.reset = true;
        }
        services.setTimerStartService(obj, function(response, status) {
            if (status) {
                factories.successCallback("Success", function() {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            } else {
                factories.error(response.message);
                factories.unAuthorize(response);
            }
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    };
});