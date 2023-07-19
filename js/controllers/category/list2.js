beyondTheWalls.controller("list2Ctrl", [
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

    services.listlevelService(1, function(response, status) {
      if (status == 1) {
        // $scope.dataList = response.data;
        $scope.dataList = _.sortBy(response.data, [
          function(o) {
            return o.name;
          }
        ]);
      }
    });

    $rootScope.level = $stateParams.level;
    $scope.getList = function() {
      var data = {};
      data.level = $rootScope.level;
      if ($scope.levelOne) {
        data.id = $scope.levelOne._id;
      }

      services.listlevelwithIdService(data, function(response, status) {
        $loading.start();
        if (status == 1) {
          // $scope.allData = response.data;
          // console.log($scope.allData)
          $scope.allData = _.sortBy(response.data, [
            function(o) {
              return o.name;
            }
          ]);
          services.datatable("tableId", {});
          $loading.finish();
        } else {
          factories.error(response.message);
          factories.unAuthorize(response);
          $loading.finish();
        }
      });
    };
    $scope.getList();

    $scope.deleteFun = function(data) {
      console.log("data", data);
      factories.confirmDelete(
        "Are you sure, Do you want to delete level 2 then dependant level 3 automatically deleted ?",
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
        templateUrl: "addEdit2.html",
        controller: "addEditCtrl2",
        size: "",
        resolve: {
          items: data
        }
      });
    };
  }
]);

beyondTheWalls.controller("addEditCtrl2", function(
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
  services.listlevelService(1, function(response, status) {
    if (status == 1) {
       $scope.dataList = response.data;
    //   $scope.dataList = _.sortBy(response.data, [
    //     function(o) {
    //       return o.name;
    //     }
    //   ]);
      if (items) {
        var findIndex = _.findIndex($scope.dataList, {
          _id: items.levelOne._id
        });
        $scope.levelOne = response.data[findIndex];
      } else {
        $scope.levelOne = response.data[0];
      }
    }
  });

  $scope.submit = function() {
    if ($scope.name) {
      $scope.cancel();
      var obj = {
        accessToken: $cookies.get("token"),
        name: $scope.name,
        level: $rootScope.level,
        levelOne: $scope.levelOne._id
      };
      if ($scope.id) {
        obj.id = $scope.id;
      }
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
