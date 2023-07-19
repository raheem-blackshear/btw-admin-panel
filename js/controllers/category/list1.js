beyondTheWalls.controller("list1Ctrl", [
  "$scope",
  "$rootScope",
  "$cookies",
  "services",
  "factories",
  "$state",
  "$stateParams",
  "$loading",
  "$timeout",
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
    $uibModal
  ) {
    console.log("res");

    $rootScope.level = $stateParams.level;
    services.listlevelService($rootScope.level, function(response, status) {
      $loading.start();
      if (status == 1) {
        // $scope.allData = response.data;
        $scope.allData = _.sortBy(response.data, [
          function(o) {
            return o.name;
          }
        ]);
        console.log($scope.allData);
        services.datatable("tableId", {});
        $loading.finish();
      } else {
        factories.error(response.message);
        factories.unAuthorize(response);
        $loading.finish();
      }
    });

    $scope.deleteFun = function(data) {
      console.log("data", data);
      factories.confirmDelete(
        "Are you sure, Do you want to delete level 1 then dependant level 2 and 3 automatically deleted ?",
        function() {
          var obj = {
            id: data._id,
            level: data.level
          };
          services.removeCategoryService(obj, function(response, status) {
            if (status == 1) {
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
            }
          });
        }
      );
    };

    $scope.addEditFun = function(data) {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: "modal-title",
        ariaDescribedBy: "modal-body",
        templateUrl: "views/parent/modal/addEdit.html",
        controller: "addEditCtrl1",
        size: "",
        resolve: {
          items: data
        }
      });
    };
    $scope.rearrangeCatFun = function() {
      console.log("all", $scope.allData);
      $uibModal.open({
        animation: true,
        ariaLabelledBy: "modal-title",
        ariaDescribedBy: "modal-body",
        templateUrl: "views/parent/modal/rearrangeCat.html",
        controller: "rearrangeCatCtrl",
        size: "sm",
        resolve: {
          items: $scope.allData
        }
      });
    };
  }
]);

beyondTheWalls.controller("rearrangeCatCtrl", function(
  $uibModalInstance,
  $scope,
  items,
  services,
  factories,
  $state
) {
  console.log("items", items);

  $scope.challenges = items.data;
  $scope.objID = [];
  var tmpList = [];
  $scope.list = [];

  angular.forEach($scope.challenges, function(value, key) {
    $scope.objID.push(value.orderId);
    tmpList.push({
      text: "Item " + key,
      value: value.orderId,
      name: value.name
    });

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
          return i.value;
        })
        .join(", ");
      $scope.sortingLog.push("Update: " + logEntry);
      console.log($scope.sortingLog, "$scope.sortingLog -->> update");
    },

    stop: function(e, ui) {
      $scope.sortingLog = [];
      // this callback has the changed model
      var logEntry = $scope.list.map(function(i) {
        return i.value;
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
          // console.log(from,'from',to)

          // console.log($scope.sortingLog, "$scope.sortingLog",$scope.objID);

          services.swapOrder($scope.objID, $scope.sortingLog[0], function(
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

  $scope.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };
});

beyondTheWalls.controller("addEditCtrl1", function(
  $stateParams,
  $state,
  $uibModalInstance,
  $scope,
  items,
  services,
  $cookies,
  $rootScope,
  factories
) {
  console.log("[][]]]][]", items);
  $scope.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };

  if (items) {
    $scope.id = items._id;
    $scope.name = items.name;
  }

  $scope.submit = function() {
    if ($scope.name) {
      $scope.cancel();
      var obj = {
        accessToken: $cookies.get("token"),
        name: $scope.name,
        level: $rootScope.level
      };

      obj.id = $scope.id;
      services.addCategoryService(obj, function(response, status) {
        if (status) {
          factories.successCallback("Success", function() {
            $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
            });
          });
          console.log("res", response);
        }
      });
    } else {
      factories.error("Please enter name");
    }
  };
});
